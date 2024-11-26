export const MONITORING_CONFIG = {
  performance: {
    thresholds: {
      // Seuils généraux
      pageLoad: 2000,
      apiResponse: 1000,
      renderTime: 500,
      databaseQuery: 800,
      
      // Seuils spécifiques aux cartes
      cardImageLoad: 1500,
      searchResponse: 1200,
      cardAnimation: 300,
      deckLoading: 1000,
      
      // Nouveaux seuils spécifiques
      cardPreview: 800,      // Aperçu rapide d'une carte
      cardZoom: 500,         // Zoom sur une carte
      cardRotation: 200,     // Animation de rotation
      cardFlip: 400,         // Animation de retournement
      filterApply: 300,      // Application des filtres
      sortingChange: 200,    // Changement de tri
      cartUpdate: 600,       // Mise à jour du panier
      wishlistSync: 1000,    // Synchronisation wishlist
      
      // Seuils de l'éditeur de deck
      deckBuilder: {
        load: 1500,          // Chargement de l'éditeur
        save: 800,           // Sauvegarde du deck
        validate: 500,       // Validation du deck
        import: 1200,        // Import d'un deck
        export: 700,         // Export d'un deck
        cardAdd: 300,        // Ajout d'une carte
        cardRemove: 300,     // Retrait d'une carte
        statsUpdate: 400,    // Mise à jour des stats
      },
      
      // Seuils du système de trading
      trading: {
        offerCreate: 1000,   // Création d'une offre
        offerAccept: 1500,   // Acceptation d'une offre
        offerCancel: 800,    // Annulation d'une offre
        chatLoad: 600,       // Chargement du chat
        messageSync: 400,    // Synchro des messages
      }
    },
    
    intervals: {
      metrics: 60000,
      cleanup: 2592000000,
      
      // Nouveaux intervalles
      aggregation: {
        realtime: 10000,     // Agrégation temps réel
        hourly: 3600000,     // Agrégation horaire
        daily: 86400000,     // Agrégation journalière
      }
    },

    metrics: {
      application: [
        'pageLoad',
        'apiResponse',
        'renderTime',
        'databaseQuery',
      ],
      pokemon: [
        'cardImageLoad',
        'searchResponse',
        'deckLoading',
        'cardAnimation',
        // Nouvelles métriques
        'cardPreview',
        'cardZoom',
        'cardRotation',
        'cardFlip',
        'filterApply',
        'sortingChange',
      ],
      deckBuilder: [
        'load',
        'save',
        'validate',
        'import',
        'export',
        'cardAdd',
        'cardRemove',
        'statsUpdate',
      ],
      trading: [
        'offerCreate',
        'offerAccept',
        'offerCancel',
        'chatLoad',
        'messageSync',
      ],
      business: [
        'paymentProcess',
        'transactionSuccess',
        'userEngagement',
        'searchToCart',
        // Nouvelles métriques business
        'cartToCheckout',
        'checkoutSuccess',
        'userRetention',
        'tradingVolume',
      ]
    }
  },

  errors: {
    critical: {
      threshold: 10,
      timeWindow: 300000,
    },
    
    patterns: [
      // Erreurs de paiement
      'paiement échoué',
      'erreur de transaction',
      'échec de validation du paiement',
      
      // Erreurs techniques
      'erreur de connexion base de données',
      'erreur de service pokemon tcg',
      'limite d\'api dépassée',
      
      // Erreurs de sécurité
      'authentification échouée',
      'token invalide',
      'accès non autorisé',
      'faille de sécurité',
      'violation de données',
      
      // Erreurs métier
      'stock insuffisant',
      'prix invalide',
      'erreur de conversion de devise',
      
      // Nouvelles erreurs spécifiques
      'deck invalide',
      'offre expirée',
      'carte indisponible',
      'limite de collection atteinte',
      'format de deck non valide',
      'restriction d\'âge',
      'compte limité',
    ],

    categories: {
      payment: {
        level: 'critical',
        notify: ['admin', 'finance'],
        response: 'immediate',
      },
      security: {
        level: 'critical',
        notify: ['admin', 'security'],
        response: 'immediate',
      },
      api: {
        level: 'warning',
        notify: ['dev'],
        response: 'standard',
      },
      business: {
        level: 'warning',
        notify: ['support', 'business'],
        response: 'standard',
      },
      // Nouvelles catégories
      trading: {
        level: 'warning',
        notify: ['support', 'trading'],
        response: 'standard',
      },
      deck: {
        level: 'info',
        notify: ['support'],
        response: 'delayed',
      },
      content: {
        level: 'info',
        notify: ['content'],
        response: 'delayed',
      }
    }
  },

  alerts: {
    slack: {
      channels: {
        critical: 'pokemon-tcg-critical',
        performance: 'pokemon-tcg-performance',
        security: 'pokemon-tcg-security',
        business: 'pokemon-tcg-business',
        support: 'pokemon-tcg-support',
        // Nouveaux canaux
        trading: 'pokemon-tcg-trading',
        content: 'pokemon-tcg-content',
        deck: 'pokemon-tcg-deck',
      },
      
      templates: {
        critical: `🚨 *ALERTE CRITIQUE*
Événement: {message}
Impact: {impact}
Détails: {details}
Actions requises: {actions}
CC: {mentions}`,

        performance: `⚠️ *ALERTE PERFORMANCE*
Métrique: {metric}
Valeur: {value}
Seuil: {threshold}
Impact: {impact}
Tendance: {trend}
Actions suggérées: {actions}`,

        security: `🔒 *ALERTE SÉCURITÉ*
Type: {type}
Détails: {details}
Impact: {impact}
Mesures prises: {measures}
Actions requises: {actions}`,

        business: `💼 *ALERTE BUSINESS*
Indicateur: {indicator}
Valeur actuelle: {value}
Objectif: {target}
Écart: {gap}
Impact estimé: {impact}
Recommandations: {recommendations}`,

        trading: `🔄 *ALERTE TRADING*
Type: {type}
Volume: {volume}
Tendance: {trend}
Anomalies: {anomalies}
Actions suggérées: {actions}`,

        deck: `🎴 *NOTIFICATION DECK*
Événement: {event}
Détails: {details}
Impact: {impact}
Recommandations: {recommendations}`,
      }
    },

    email: {
      recipients: {
        critical: ['admin@pokemon-tcg.com', 'tech-lead@pokemon-tcg.com'],
        performance: ['dev-team@pokemon-tcg.com'],
        security: ['security@pokemon-tcg.com'],
        business: ['business@pokemon-tcg.com'],
        support: ['support@pokemon-tcg.com'],
        // Nouveaux groupes
        trading: ['trading@pokemon-tcg.com'],
        content: ['content@pokemon-tcg.com'],
        deck: ['deck-support@pokemon-tcg.com'],
      },
      
      templates: {
        subject: '[Pokemon TCG] {type} - {summary}',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1a237e; color: white; padding: 20px; border-radius: 5px 5px 0 0;">
              <h2 style="margin: 0;">{title}</h2>
              <p style="margin: 5px 0 0 0; opacity: 0.8;">{date}</p>
            </div>
            
            <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0;">
              <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="color: #1a237e; margin-top: 0;">Résumé</h3>
                <p>{description}</p>
              </div>

              <div style="margin-bottom: 20px;">
                <h3 style="color: #1a237e;">Détails</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Type:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">{type}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Sévérité:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">{severity}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Impact:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">{impact}</td>
                  </tr>
                </table>
              </div>

              <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="color: #1a237e; margin-top: 0;">Données Techniques</h3>
                <pre style="background: #fff; padding: 10px; border-radius: 3px; overflow-x: auto;">{details}</pre>
              </div>

              <div style="background: #e8f5e9; padding: 15px; border-radius: 5px;">
                <h3 style="color: #1a237e; margin-top: 0;">Actions Recommandées</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  {actions}
                </ul>
              </div>
            </div>

            <div style="background: #f5f5f5; padding: 15px; border-radius: 0 0 5px 5px; font-size: 0.9em; color: #666;">
              <p style="margin: 0;">
                Cet email a été envoyé automatiquement par le système de monitoring de Pokemon TCG Marketplace.
                <br>
                Pour plus d'informations, consultez le <a href="{dashboardUrl}" style="color: #1a237e;">tableau de bord</a>.
              </p>
            </div>
          </div>
        `
      }
    }
  },

  transactions: {
    thresholds: {
      failedCount: 3,
      timeWindow: 3600000,
      maxRetries: 3,
      minSuccessRate: 95,
      
      // Nouveaux seuils
      maxProcessingTime: 5000,  // Temps maximum de traitement
      maxPendingTime: 300000,   // Temps maximum en attente
      maxRetryDelay: 60000,     // Délai maximum entre les tentatives
    },
    
    types: [
      'achat_carte',
      'vente_carte',
      'echange_carte',
      'remboursement',
      'mise_enchere',
      'offre_speciale',
      // Nouveaux types
      'pack_opening',
      'fusion_carte',
      'transfert_deck',
      'boost_carte',
    ],

    business: {
      thresholds: {
        hourlyRevenue: 1000,
        dailyTransactions: 100,
        conversionRate: 2.5,
        cartAbandonment: 75,
        
        // Nouveaux seuils business
        tradingVolume: 500,      // Volume minimum d'échanges par jour
        newUsers: 50,            // Nouveaux utilisateurs par jour
        userRetention: 40,       // Taux de rétention en pourcentage
        averageOrderValue: 25,   // Valeur moyenne des commandes en €
      },
      
      periods: {
        revenue: 3600000,
        transactions: 86400000,
        conversion: 86400000,
        
        // Nouvelles périodes
        trading: 86400000,       // Analyse du trading quotidienne
        retention: 604800000,    // Analyse de la rétention hebdomadaire
        engagement: 86400000,    // Analyse de l'engagement quotidienne
      }
    }
  }
};
