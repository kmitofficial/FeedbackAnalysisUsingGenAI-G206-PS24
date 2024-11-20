import React from 'react'
import './Section6.css'

const Section6 = () => {
    const plans = [
        {
          id: 1,
          title: 'Basic Plan',
          details: [
            'Feature 1: Access to basic features',
            'Feature 2: 24/7 customer support',
            'Feature 3: Monthly reports',
            'Feature 4: Community access',
          ],
        },
        {
          id: 2,
          title: 'Standard Plan',
          details: [
            'Feature 1: Everything in Basic',
            'Feature 2: Customizable options',
            'Feature 3: Weekly reports',
            'Feature 4: Priority support',
          ],
        },
        {
          id: 3,
          title: 'Premium Plan',
          details: [
            'Feature 1: Everything in Standard',
            'Feature 2: Dedicated account manager',
            'Feature 3: Daily reports',
            'Feature 4: VIP support',
          ],
        },
      ];
    
      return (
        <div className="section6" id='pricing'>
          <div className="pricing-container">
          <h1 className="title">Our Pricing Plans</h1>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <div className="pricing-card" key={plan.id}>
                <h2 className="plan-title">{plan.title}</h2>
                {plan.details.map((detail, index) => (
                  <p key={index} className="plan-detail">
                    {detail}
                  </p>
                ))}
                <div className="button-container">
                  <button className="btn">Choose Plan</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      );
}

export default Section6
