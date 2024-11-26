import React, { useEffect, useState } from 'react';
import { useMonitoring } from '../hooks/useMonitoring';

interface PokemonCardProps {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ id, name, imageUrl, price }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { startMetric, logError } = useMonitoring();

  useEffect(() => {
    const endMetric = startMetric('cardImageLoad');
    
    const img = new Image();
    img.src = imageUrl;
    
    img.onload = () => {
      setIsLoading(false);
      endMetric();
    };
    
    img.onerror = (error) => {
      setIsLoading(false);
      logError(new Error('Erreur de chargement de l\'image'), {
        cardId: id,
        imageUrl,
        error,
      });
    };
  }, [imageUrl, id, startMetric, logError]);

  const handleBuyClick = async () => {
    const endMetric = startMetric('paymentProcess');
    
    try {
      // Logique d'achat ici
      endMetric();
    } catch (error) {
      logError(error as Error, {
        action: 'buy',
        cardId: id,
        price,
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="pokemon-card">
      <img src={imageUrl} alt={name} />
      <h3>{name}</h3>
      <p>{price}€</p>
      <button onClick={handleBuyClick}>Acheter</button>
    </div>
  );
};
