# Payment System Configuration

## UPI Payment Setup Guide

### 1. Where to Add Your UPI ID

**File:** `client/src/pages/Checkout.js`

**Location:** Around line 140
```jsx
<p>
  <strong>UPI ID:</strong> <code>yourbusiness@upi</code>
</p>
```

**Change to:**
```jsx
<p>
  <strong>UPI ID:</strong> <code>your_actual_upi_id@bankname</code>
</p>
```

**Examples:**
- `sharma@okhdfcbank`
- `john.doe@googleplay`
- `business@ybl`
- `flowers@paytm`

---

## 2. UPI QR Code

### Option A: Static QR Code (Current)
- Currently showing placeholder
- Users scan and pay manually
- Admin verifies screenshot

### Option B: Generate Dynamic QR Code

To add actual QR code generation, install library:

```bash
cd client
npm install qrcode.react
```

Then update Checkout.js:

```jsx
import QRCode from 'qrcode.react';

// In payment section:
<QRCode 
  value={`upi://pay?pa=yourbusiness@upi&pn=Handmade%20Flowers&tn=Product%20Purchase&am=${product.price}`}
  size={200}
/>
```

---

## 3. Payment Flow

### Customer Steps
1. Sees UPI ID and QR code
2. Scans QR with UPI app (Google Pay, PhonePe, etc.)
3. Enters amount (auto-filled if using QR)
4. Completes payment
5. Saves/screenshots payment confirmation
6. Gets Transaction ID from UPI notification
7. Uploads screenshot + Transaction ID
8. Order submitted to admin

### What's a Transaction ID?
- Unique identifier for each UPI transaction
- Looks like: `UPI123456789` or `TXN202401151234`
- Found in UPI app transaction history
- Shown in payment confirmation message

---

## 4. Admin Verification Checklist

When reviewing payment screenshots, verify:

- ✓ UPI ID matches your business ID
- ✓ Amount matches product price
- ✓ Payment status shows "Success" or "Completed"
- ✓ Transaction ID is provided
- ✓ Date is recent (within 24 hours)
- ✓ All customer details are correct

---

## 5. Order Status Flow

### Pending State
- Customer submitted order
- Admin hasn't verified yet
- Message: "Waiting for verification"

### Approved State
- Admin verified payment
- Order accepted
- Message: "Order Confirmed"
- Next step: Admin processes fulfillment

### Rejected State
- Admin couldn't verify payment
- Reasons: Unclear screenshot, wrong amount, invalid ID
- Message: "Payment not verified"
- Customer can retry with new payment

---

## 6. Set Payment Details Dynamically

To display different UPI IDs for different products/orders:

**In Checkout.js:**
```jsx
// Get UPI ID from environment
const UPI_ID = process.env.REACT_APP_UPI_ID || 'yourbusiness@upi';

// Or from database
const [businessUPI, setBusinessUPI] = useState('');

useEffect(() => {
  // Fetch UPI ID from settings API
  fetchBusinessSettings();
}, []);

<code>{UPI_ID}</code>
```

**.env file:**
```
REACT_APP_UPI_ID=yourname@upiservice
```

---

## 7. Security Best Practices

1. **Never hardcode** sensitive data
2. **Use .env files** for credentials
3. **HTTPS only** in production
4. **Verify screenshots** manually or with AI
5. **Keep transaction records** for disputes
6. **Use payment gateway** for higher volumes

---

## 8. Future Enhancements

### Recommended Payment Upgrades
1. **Real Payment Gateway**
   - Razorpay (India)
   - PayU (India)
   - Stripe (Global)

2. **Automated Verification**
   - Receipt OCR scanning
   - AI payment verification
   - Instant confirmation

3. **Additional Methods**
   - Card payments
   - Net banking
   - Wallet payments

---

## 9. Testing Payment Workflow

### Test Data
```
UPI ID: testuser@upi
Amount: ₹299
Transaction ID: TEST123456789
```

### How to Test
1. Use real test account on UPI app
2. Or take screenshot from real payment
3. Upload as test order
4. Approve in admin panel
5. Verify order status updates

---

## 10. Troubleshooting

### Issue: Customer can't see UPI ID
**Solution:** Check Checkout.js, ensure UPI ID is in the code

### Issue: QR code not scanning
**Solution:** 
- Use qrcode.react library
- Test QR on multiple UPI apps
- Ensure data format is correct

### Issue: Transaction ID not matching
**Solution:**
- Verify format in payment screenshot
- Check for spaces/typos
- Request from customer if unclear

---

## 11. Customer Communication Templates

### Order Confirmed Email
```
Dear Customer,

Your order has been confirmed!

Transaction ID: [ID]
Amount: ₹[amount]
Product: [product name]

We will deliver within 5-7 business days.

Thank you for your purchase!
```

### Payment Not Verified Email
```
Dear Customer,

We couldn't verify your payment. Reasons:
- [Screenshot unclear]
- [Amount mismatch]
- [Wrong UPI ID]

Please resubmit with:
1. Clear screenshot
2. Correct Transaction ID
3. Matching amount

Contact us if you need help!
```

---

## Quick Reference

| Field | Format | Example |
|-------|--------|---------|
| UPI ID | `name@bank` | `sharma@okhdfcbank` |
| Transaction ID | Alphanumeric | `UPI123456789` |
| Amount | Numeric | `299` |
| Screenshot | JPG/PNG | payment_proof.jpg |

---

**Your payment system is ready to accept orders!**
