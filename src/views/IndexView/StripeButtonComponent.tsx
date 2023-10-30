import * as React from 'react';


const StripeButtonComponent: React.FC = () => {
  return (
    <>
      <script async src="https://js.stripe.com/v3/buy-button.js"></script>
      <stripe-buy-button
        buy-button-id="buy_btn_1O41mSHC7ViVR1nY6Hw5zHcy"
        publishable-key={process.env.NEXT_PUBLIC_PUBLISHABLE_KEY}
      />
    </>
  );
};

export default StripeButtonComponent;
