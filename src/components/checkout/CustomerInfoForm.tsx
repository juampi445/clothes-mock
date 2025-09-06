import styles from './CustomerInfoForm.module.scss';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
}

export default function CustomerInfoForm({ customerInfo, setCustomerInfo }: CustomerInfoFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value
    });
  };

  return (
    <div className={styles.formSection}>
      <h3>Shipping Information</h3>
      <div className="row">
        <div className="col-md-6">
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={customerInfo.firstName}
              onChange={handleChange}
              className={styles.formControl}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={customerInfo.lastName}
              onChange={handleChange}
              className={styles.formControl}
              required
            />
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={customerInfo.email}
          onChange={handleChange}
          className={styles.formControl}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="address">Street Address *</label>
        <input
          type="text"
          id="address"
          name="address"
          value={customerInfo.address}
          onChange={handleChange}
          className={styles.formControl}
          required
        />
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className={styles.formGroup}>
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={customerInfo.city}
              onChange={handleChange}
              className={styles.formControl}
              required
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className={styles.formGroup}>
            <label htmlFor="zipCode">ZIP Code *</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={customerInfo.zipCode}
              onChange={handleChange}
              className={styles.formControl}
              required
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className={styles.formGroup}>
            <label htmlFor="country">Country *</label>
            <select
              id="country"
              name="country"
              value={customerInfo.country}
              onChange={handleChange}
              className={styles.formControl}
              required
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="ES">Spain</option>
              <option value="IT">Italy</option>
              <option value="JP">Japan</option>
              <option value="BR">Brazil</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
