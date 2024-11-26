import { Request, Response } from 'express';
import Stripe from 'stripe';
import { db } from '../config/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];

  if (!sig || !webhookSecret) {
    return res.status(400).send('Webhook signature manquante');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Erreur de signature webhook:', err);
    return res.status(400).send('Signature invalide');
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.dispute.created':
        await handleDispute(event.data.object as Stripe.Dispute);
        break;

      default:
        console.log(`Type d'événement non géré: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Erreur lors du traitement du webhook:', err);
    res.status(500).send('Erreur interne du serveur');
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { metadata } = paymentIntent;
  if (!metadata?.orderId) return;

  const orderRef = db.collection('orders').doc(metadata.orderId);
  const transactionRef = db.collection('transactions').doc();

  await db.runTransaction(async (transaction) => {
    const orderDoc = await transaction.get(orderRef);
    if (!orderDoc.exists) {
      throw new Error('Commande non trouvée');
    }

    const orderData = orderDoc.data();
    if (!orderData) return;

    // Mettre à jour le statut de la commande
    transaction.update(orderRef, {
      status: 'completed',
      paymentIntentId: paymentIntent.id,
      updatedAt: new Date(),
    });

    // Créer une transaction
    transaction.set(transactionRef, {
      orderId: metadata.orderId,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      buyerId: orderData.buyerId,
      sellerId: orderData.sellerId,
      status: 'completed',
      createdAt: new Date(),
    });

    // Mettre à jour le statut de la carte
    const cardRef = db.collection('marketplace').doc(orderData.cardId);
    transaction.update(cardRef, {
      status: 'sold',
      soldAt: new Date(),
    });
  });
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const { metadata } = paymentIntent;
  if (!metadata?.orderId) return;

  await db.collection('orders').doc(metadata.orderId).update({
    status: 'payment_failed',
    updatedAt: new Date(),
    error: paymentIntent.last_payment_error?.message || 'Échec du paiement',
  });
}

async function handleDispute(dispute: Stripe.Dispute) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    dispute.payment_intent as string
  );

  if (!paymentIntent.metadata?.orderId) return;

  await db.collection('orders').doc(paymentIntent.metadata.orderId).update({
    status: 'disputed',
    updatedAt: new Date(),
    disputeId: dispute.id,
    disputeReason: dispute.reason,
  });

  // Notifier l'administrateur
  console.error('Litige créé:', {
    disputeId: dispute.id,
    orderId: paymentIntent.metadata.orderId,
    reason: dispute.reason,
    amount: dispute.amount,
  });
}
