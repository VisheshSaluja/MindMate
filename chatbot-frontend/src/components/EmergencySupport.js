import React from 'react';
import './EmergencySupport.css';

const EmergencySupport = () => {
  return (
    <div className="emergency-support">
      <h3>Need Help Now?</h3>
      <p>If you're in crisis, please call a support line:</p>
      <ul>
        <li><strong>Suicide Prevention Hotline:</strong> <a href="tel:988">988</a></li>
        <li><strong>Text Support:</strong> <a href="sms:741741">Text HOME to 741741</a></li>
        <li><strong>Emergency:</strong> <a href="tel:911">911</a></li>
      </ul>
    </div>
  );
};

export default EmergencySupport;