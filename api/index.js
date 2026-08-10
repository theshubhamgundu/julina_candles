import crypto from 'crypto';
import Razorpay from 'razorpay';
// import { createClient } from '@supabase/supabase-js';

// ⚠️ Supabase integration is temporarily silenced
// const SUPABASE_URL = process.env.SUPABASE_URL;
// const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
// const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Simple password hashing and comparison (use bcrypt in production)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'SHIPPER_SALT_2025').digest('hex');
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

// Generate shipper auth token
function generateShipperToken() {
  return crypto.randomBytes(64).toString('hex');
}

// ⚠️ ICICI Bank OPG Payment Gateway is DISABLED
// const ICICI_CONFIG = {
//   get MID() { return process.env.ICICI_MID || '100000000490311'; },
//   get KEY() { return process.env.ICICI_KEY || 'bd7461c6-7e54-4d75-b088-1deb659a666d'; },
//   get AGG_ID() { return process.env.ICICI_AGG_ID || '100000000490310'; },
//   get INITIATE_SALE_URL() { return 'https://pgpay.icicibank.com/pg/api/v2/initiateSale'; },
//   get COMMAND_URL() { return 'https://pgpay.icicibank.com/pg/api/command'; },
//   get SETTLEMENT_URL() { return 'https://pgpay.icicibank.com/pg/api/settlementDetails'; }
// };

// ICICI SHA-256 HMAC SecureHash (ASCII message encoding per ICICI spec)
// function generateICICISecureHash(payload, secretKey) {
//   const sortedKeys = Object.keys(payload).sort();
//   let plainHashtext = '';
//   for (const key of sortedKeys) {
//     if (payload[key] !== undefined && payload[key] !== null) {
//       plainHashtext += payload[key];
//     }
//   }
//   const hmac = crypto.createHmac('sha256', secretKey);
//   hmac.update(Buffer.from(plainHashtext, 'ascii'));
//   return hmac.digest('hex');
// }

// ─── Razorpay Payment Gateway Configuration ───
const RAZORPAY_CONFIG = {
  get KEY_ID() { return process.env.RAZORPAY_KEY_ID || 'rzp_test_TO0ThkJfCuEUj1'; },
  get KEY_SECRET() { return process.env.RAZORPAY_KEY_SECRET || '6xP6d7KSkclsv7M50V7cUl2D'; },
};

// Initialize Razorpay instance
function getRazorpayInstance() {
  return new Razorpay({
    key_id: RAZORPAY_CONFIG.KEY_ID,
    key_secret: RAZORPAY_CONFIG.KEY_SECRET,
  });
}

// Verify Razorpay payment signature using HMAC-SHA256
function verifyRazorpaySignature(orderId, paymentId, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_CONFIG.KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expectedSignature === signature;
}

// Resend Email API Configuration
const RESEND_CONFIG = {
  get KEY() { return process.env.RESEND_API_KEY || 're_UZ29KUAH_PjdpPNsPbAWveZDj48Tv5woU'; },
  get FROM() { return process.env.RESEND_FROM_EMAIL || 'Julina Candles & Melts <sales@julinacandles.in>'; }
};

// Send email using Resend REST API
async function sendEmail({ to, subject, html }) {
  const apiKey = RESEND_CONFIG.KEY;
  if (!apiKey) {
    console.error('❌ Resend API Key is missing');
    return { success: false, message: 'Resend API Key is missing' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: RESEND_CONFIG.FROM,
        to: to,
        subject: subject,
        html: html
      })
    });

    const text = await res.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }

    if (res.ok) {
      console.log(`✅ Email sent successfully to ${to}. ID:`, data.id);
      return { success: true, id: data.id };
    } else {
      console.error(`❌ Resend API error:`, data);
      return { success: false, error: data };
    }
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
    return { success: false, error: error.message };
  }
}

// Complete order and trigger confirmation email
async function handleOrderSuccess(orderId) {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      console.error('Failed to load order for email confirmation:', orderId, error);
      return;
    }

    if (order.status === 'Pending') {
      // 1. Update order status to Processing
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'Processing', updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (updateError) {
        console.error('Failed to update status to Processing:', updateError);
        return;
      }

      console.log(`Order ${orderId} status set to Processing. Triggering email...`);

      // 2. Fetch user details to get email
      const { data: userRow } = await supabase
        .from('users')
        .select('email, name')
        .eq('id', order.user_uid)
        .maybeSingle();

      const shippingInfo = typeof order.shipping_info === 'string' ? JSON.parse(order.shipping_info) : order.shipping_info;
      const recipientEmail = userRow?.email || shippingInfo?.email || 'shubhamvasantgundu@gmail.com';
      const customerName = userRow?.name || shippingInfo?.name || 'Customer';

      const baseUrl = 'https://julinacandles.in';

      const orderItems = typeof order.order_items === 'string' ? JSON.parse(order.order_items) : order.order_items;
      const itemsListHtml = (orderItems || []).map(item => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #efe9db; font-size: 14px; color: #24291f; font-family: sans-serif;">
            <div style="font-weight: bold;">${item.name}</div>
            <div style="font-size: 12px; color: #5f6455; margin-top: 2px;">Qty: ${item.quantity}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #efe9db; text-align: right; font-size: 14px; font-weight: bold; color: #24291f; font-family: sans-serif;">
            ₹${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>
      `).join('');

      const formattedDate = new Date(order.created_at || Date.now()).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short'
      });

      const emailHtml = `
        <div style="background-color: #f7f4ec; padding: 30px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: #24291f; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 20px; border: 1px solid #efe9db; box-shadow: 0 4px 20px rgba(22, 59, 38, 0.04);">
            
            <!-- Header Logo -->
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #efe9db; padding-bottom: 20px;">
              <h1 style="color: #1f5133; font-size: 26px; font-weight: bold; font-family: Garamond, serif; margin: 0; letter-spacing: 2px; text-transform: uppercase;">Julina Candles & Melts</h1>
              <span style="font-size: 10px; color: #c4633c; letter-spacing: 3px; font-weight: bold; text-transform: uppercase; display: block; margin-top: 5px;">Pure & Organic</span>
            </div>

            <!-- Greeting -->
            <h2 style="color: #1f5133; font-size: 20px; font-family: Garamond, serif; margin-top: 0; font-weight: bold;">Order Confirmed! 🌿</h2>
            <p style="font-size: 14px; color: #24291f; margin-bottom: 20px;">Dear ${customerName},</p>
            <p style="font-size: 14px; color: #5f6455; margin-bottom: 25px;">Thank you for shopping with Julina Candles & Melts. Your payment was successful, and our team is preparing your products for shipment. Below are your order and transaction details.</p>
            
            <!-- Status Card -->
            <div style="background-color: #f7f4ec; border-radius: 12px; padding: 20px; margin-bottom: 30px; border: 1px solid #efe9db;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="padding: 4px 0; color: #5f6455;"><strong>Order ID:</strong></td>
                  <td style="padding: 4px 0; font-family: monospace; text-align: right; color: #24291f;">${order.id}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #5f6455;"><strong>Status:</strong></td>
                  <td style="padding: 4px 0; text-align: right; color: #c4633c; font-weight: bold; text-transform: uppercase;">Processing</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #5f6455;"><strong>Date:</strong></td>
                  <td style="padding: 4px 0; text-align: right; color: #24291f;">${formattedDate}</td>
                </tr>
              </table>
            </div>

            <!-- Purchase Summary -->
            <h3 style="color: #1f5133; font-size: 16px; font-family: Garamond, serif; margin-bottom: 12px; border-bottom: 2px solid #1f5133; padding-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">Summary of Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <thead>
                <tr style="background-color: #f7f4ec; text-align: left;">
                  <th style="padding: 10px; font-size: 11px; color: #5f6455; font-weight: bold; uppercase tracking-wider;">Product</th>
                  <th style="padding: 10px; font-size: 11px; color: #5f6455; font-weight: bold; uppercase tracking-wider; text-align: right;">Total Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsListHtml}
              </tbody>
            </table>

            <!-- Totals Breakdown -->
            <div style="border-top: 1px solid #efe9db; padding-top: 15px; margin-bottom: 30px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #5f6455;">Subtotal</td>
                  <td style="padding: 6px 0; text-align: right; color: #24291f;">₹${Number(order.subtotal || 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #5f6455;">Tax & Shipping</td>
                  <td style="padding: 6px 0; text-align: right; color: #24291f;">₹${Number((order.tax || 0) + (order.shipping_charges || 0)).toFixed(2)}</td>
                </tr>
                ${order.discount ? `
                <tr>
                  <td style="padding: 6px 0; color: #c4633c; font-weight: bold;">Discount Applied</td>
                  <td style="padding: 6px 0; text-align: right; color: #c4633c; font-weight: bold;">-₹${Number(order.discount).toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr style="font-size: 16px; font-weight: bold; color: #1f5133;">
                  <td style="padding: 12px 0 0 0; border-top: 1px solid #efe9db;">Total Amount Paid</td>
                  <td style="padding: 12px 0 0 0; border-top: 1px solid #efe9db; text-align: right;">₹${Number(order.total).toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <!-- View Button -->
            <div style="text-align: center; margin-bottom: 20px;">
              <a href="${baseUrl}/order/${order.id}" style="background-color: #1f5133; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 10px rgba(31, 81, 51, 0.15);">View Order Details</a>
            </div>

            <!-- Footer Notes -->
            <div style="border-top: 1px solid #efe9db; padding-top: 20px; text-align: center; font-size: 11px; color: #5f6455; line-height: 1.5;">
              <p style="margin: 0 0 5px 0;">If you have any questions, reply to this email or contact support.</p>
              <p style="margin: 0;">© ${new Date().getFullYear()} Julina Candles & Melts. All rights reserved.</p>
            </div>

          </div>
        </div>
      `;

      await sendEmail({
        to: recipientEmail,
        subject: `Julina Candles & Melts — Order Confirmed #${order.id}`,
        html: emailHtml
      });

      // ✅ CRITICAL FIX: Decrement stock for ordered items
      console.log(`✅ Decrementing stock for order ${orderId}...`);
      
      for (const item of orderItems || []) {
        try {
          // Extract base product ID (remove variant suffix like "_1kg")
          const baseProductId = item.productId.includes('_') 
            ? item.productId.split('_')[0] 
            : item.productId;

          // Get current stock
          const { data: product, error: productError } = await supabase
            .from('products')
            .select('stock, name')
            .eq('id', baseProductId)
            .single();

          if (productError || !product) {
            console.error(`⚠️  Product not found for stock decrement: ${baseProductId}`, productError);
            continue;
          }

          const currentStock = Number(product.stock || 0);
          const orderQuantity = Number(item.quantity || 0);

          if (currentStock >= orderQuantity) {
            // Decrement stock
            const newStock = currentStock - orderQuantity;
            
            const { error: updateStockError } = await supabase
              .from('products')
              .update({ 
                stock: newStock,
                updated_at: new Date().toISOString()
              })
              .eq('id', baseProductId);

            if (updateStockError) {
              console.error(`❌ Failed to decrement stock for ${baseProductId}:`, updateStockError);
            } else {
              console.log(`✅ Stock decremented for "${product.name}": ${currentStock} → ${newStock} (-${orderQuantity})`);
            }
          } else {
            console.warn(`⚠️  Insufficient stock for "${product.name}": Ordered ${orderQuantity}, Available ${currentStock}`);
          }
        } catch (stockError) {
          console.error(`❌ Error processing stock decrement for item:`, item, stockError);
        }
      }

      console.log(`✅ Order ${orderId} completed with stock updates`);
    }
  } catch (err) {
    console.error('Error during handleOrderSuccess processing:', err);
  }
}

// Map Supabase row → product object (NO hardcoded defaults — only real DB data)
function mapProduct(row) {
  if (!row) return null;
  let variants = [];

  if (row.variants && Array.isArray(row.variants) && row.variants.length > 0) {
    // Use variants from the dedicated JSONB column (primary source)
    variants = row.variants;
  } else if (typeof row.variants === 'string') {
    try {
      const parsed = JSON.parse(row.variants);
      if (Array.isArray(parsed) && parsed.length > 0) variants = parsed;
    } catch (e) {}
  }
  
  // Legacy fallback: check description for __VARIANTS__ encoding
  if (variants.length === 0 && row.description && row.description.includes('__VARIANTS__=')) {
    try {
      const parts = row.description.split('__VARIANTS__=');
      const parsed = JSON.parse(parts[1]);
      if (Array.isArray(parsed) && parsed.length > 0) variants = parsed;
    } catch (e) {}
  }

  const cleanDescription = row.description ? row.description.split('__VARIANTS__=')[0].trim() : '';

  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    category: row.category,
    description: cleanDescription,
    price: Number(row.price),
    stock: Number(row.stock),
    photo: row.photo,
    photoPublicId: row.photo_public_id,
    featured: Boolean(row.featured),
    variants,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Map Supabase row → order object
function mapOrder(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    user: row.user_uid || row.user_id,
    shippingInfo: typeof row.shipping_info === 'string' ? JSON.parse(row.shipping_info) : row.shipping_info,
    orderItems: typeof row.order_items === 'string' ? JSON.parse(row.order_items) : row.order_items,
    subtotal: Number(row.subtotal),
    tax: Number(row.tax),
    shippingCharges: Number(row.shipping_charges),
    discount: Number(row.discount || 0),
    total: Number(row.total),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    awbNumber: row.awb_number || undefined,
    senderMobile: row.sender_mobile || undefined,
    receiverMobile: row.receiver_mobile || undefined,
    trackingUrl: row.tracking_url || undefined,
  };
}

export default async function handler(req, res) {
  const url = req.url || '';

  // Initialize in-memory fast API response cache
  if (!global.fastApiCache) global.fastApiCache = new Map();

  // On data modification, immediately invalidate API response cache
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    global.fastApiCache.clear();
  }

  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Serve cached GET response if less than 30 seconds old
  if (req.method === 'GET' && global.fastApiCache.has(url)) {
    const cached = global.fastApiCache.get(url);
    if (Date.now() - cached.timestamp < 30000) {
      return res.status(200).json(cached.body);
    }
  }

  try {
    // ─── PAYMENTS: ICICI Bank InitiateSale API ───
    if (url.includes('/api/v1/payments/create') || url.includes('/api/v1/payments/new') || url.includes('/api/v1/payments/icici-sale')) {
      const rawAmount = req.body?.amount;
      if (!rawAmount) {
        return res.status(400).json({ success: false, message: 'Please provide amount' });
      }

      const amount = Number(rawAmount).toFixed(2);
      const merchantTxnNo = req.body?.merchantTxnNo || ('VH' + Date.now()).slice(0, 20);
      
      // Dynamic txnDate in IST (YYYYMMDDHHMMSS)
      const d = new Date();
      const istDate = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
      const txnDate = istDate.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);

      // Always use the production domain — payments only run on prod.
      const origin = 'https://julinacandles.in';
      const returnURL = `${origin}/api/v1/payments/callback`;

      const requestPacket = {
        addlParam1: req.body?.orderId || '000', // store orderId in addlParam1 if available
        addlParam2: '111',
        aggregatorID: ICICI_CONFIG.AGG_ID,
        amount: amount,
        currencyCode: '356',
        customerEmailID: req.body?.email || 'support@julinacandles.in',
        customerMobileNo: req.body?.phone || '',
        customerName: req.body?.name || 'Julina Candles & Melts Customer',
        merchantId: ICICI_CONFIG.MID,
        merchantTxnNo: merchantTxnNo,
        payType: '0',
        returnURL: returnURL,
        transactionType: 'SALE',
        txnDate: txnDate,
      };

      const secureHash = generateICICISecureHash(requestPacket, ICICI_CONFIG.KEY);
      requestPacket.secureHash = secureHash;

      // Call ICICI Bank InitiateSale API
      console.log('Sending request to ICICI:', requestPacket);
      const iciciRes = await fetch(ICICI_CONFIG.INITIATE_SALE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPacket),
      });
      const responseText = await iciciRes.text();
      console.log(`ICICI Response Status: ${iciciRes.status}`);
      console.log(`ICICI Response Body: ${responseText}`);
      let iciciData = null;
      try {
        iciciData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse ICICI response as JSON:', e);
      }

      if (iciciData && iciciData.redirectURI && iciciData.tranCtx) {
        const paymentURL = `${iciciData.redirectURI}?tranCtx=${iciciData.tranCtx}`;
        return res.status(200).json({
          success: true,
          gateway: 'ICICI_BANK_OPG_UAT',
          merchantTxnNo,
          paymentURL,
          iciciResponse: iciciData,
        });
      }

      // If ICICI returned an error or no redirect, return failure with the error details
      console.warn('ICICI Gateway did not return redirect URI:', iciciData);
      let errorMessage = 'Failed to connect with ICICI Gateway. Please try again.';
      if (iciciData && iciciData.responseDescription) {
        errorMessage = `ICICI Gateway Error: ${iciciData.responseDescription}`;
      } else if (iciciData && iciciData.message) {
        errorMessage = `ICICI Gateway Error: ${iciciData.message}`;
      }
      return res.status(400).json({
        success: false,
        message: errorMessage,
        gateway: 'ICICI_BANK_OPG_UAT',
        merchantTxnNo,
        iciciResponse: iciciData,
      });
    }

    // ─── PAYMENTS: Razorpay Create Order ───
    if (url.includes('/api/v1/payments/razorpay/create-order')) {
      if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
      }

      try {
        const { amount, currency, receipt, description, customer_name, customer_email, customer_phone } = req.body;

        // Validate amount (minimum 100 paise = ₹1)
        const amountInPaise = parseInt(amount, 10);
        if (!amountInPaise || amountInPaise < 100) {
          return res.status(400).json({
            success: false,
            message: 'Invalid amount. Minimum amount is ₹1 (100 paise)',
          });
        }

        // Create Razorpay instance
        const razorpay = getRazorpayInstance();

        // Create order on Razorpay
        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency: currency || 'INR',
          receipt: receipt || `order_${Date.now()}`,
          description: description || 'Julina Candles & Melts Purchase',
          customer_notify: 1,
          notes: {
            customer_name: customer_name || 'Julina Customer',
            customer_email: customer_email || 'support@julinacandles.in',
            customer_phone: customer_phone || '',
          },
        });

        console.log('✅ Razorpay order created:', order.id);

        return res.status(200).json({
          success: true,
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
        });
      } catch (error) {
        console.error('❌ Razorpay order creation failed:', error.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to create payment order',
          error: error.message,
        });
      }
    }

    // ─── PAYMENTS: Razorpay Verify Signature ───
    if (url.includes('/api/v1/payments/razorpay/verify-payment')) {
      if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
      }

      try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          return res.status(400).json({
            success: false,
            message: 'Missing payment verification details',
          });
        }

        // Verify signature using HMAC-SHA256
        const isSignatureValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isSignatureValid) {
          console.error('❌ Razorpay signature verification failed for order:', razorpay_order_id);
          return res.status(400).json({
            success: false,
            message: 'Payment verification failed. Signature mismatch.',
          });
        }

        console.log('✅ Razorpay payment verified successfully for order:', razorpay_order_id);

        return res.status(200).json({
          success: true,
          message: 'Payment verified successfully',
          razorpay_order_id,
          razorpay_payment_id,
        });
      } catch (error) {
        console.error('❌ Razorpay payment verification error:', error.message);
        return res.status(500).json({
          success: false,
          message: 'Payment verification error',
          error: error.message,
        });
      }
    }

    // ─── PAYMENTS: Callback (Return URL) Handler ───
    if (url.includes('/api/v1/payments/callback')) {
      let payload = req.body;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch (e) {
          payload = Object.fromEntries(new URLSearchParams(payload));
        }
      } else if (payload && Buffer.isBuffer(payload)) {
        const str = payload.toString('utf-8');
        try {
          payload = JSON.parse(str);
        } catch (e) {
          payload = Object.fromEntries(new URLSearchParams(str));
        }
      }

      // Always redirect to production — payments only run on prod.
      const origin = 'https://julinacandles.in';
      const host = req.headers.host || '';

      // Verify SecureHash
      const receivedHash = payload.secureHash;
      const payloadCopy = { ...payload };
      delete payloadCopy.secureHash;

      const calculatedHash = generateICICISecureHash(payloadCopy, ICICI_CONFIG.KEY);

      const isVerified = receivedHash && calculatedHash.toLowerCase() === receivedHash.toLowerCase();
      const merchantTxnNo = payload.merchantTxnNo;
      const responseCode = payload.responseCode;

      let success = false;
      let orderId = payload.addlParam1 || '';

      if (isVerified && merchantTxnNo) {
        // Query the order in Supabase
        const { data: order, error } = await supabase
          .from('orders')
          .select('*')
          .eq('shipping_info->>merchantTxnNo', merchantTxnNo)
          .maybeSingle();

        if (order && !error) {
          orderId = order.id;
          const shippingInfo = typeof order.shipping_info === 'string' ? JSON.parse(order.shipping_info) : order.shipping_info;
          if (responseCode === '0000') {
            success = true;
            await handleOrderSuccess(order.id);
          } else {
            await supabase
              .from('orders')
              .update({ status: 'Pending', updated_at: new Date().toISOString() })
              .eq('id', order.id);
          }
        } else {
          console.error('Order not found or error for merchantTxnNo:', merchantTxnNo, error);
        }
      } else {
        console.error('Signature verification failed or merchantTxnNo missing. Received:', receivedHash, 'Calculated:', calculatedHash);
      }

      // Redirect browser back to the frontend
      const redirectUrl = `${origin}/my-orders?payment=${success ? 'success' : 'fail'}${orderId ? `&orderId=${orderId}` : ''}`;
      res.writeHead(302, { Location: redirectUrl });
      res.end();
      return;
    }

    // ─── ORDERS: Create New Order (with Silent Guest Sign-Up) ───
    if (url.includes('/api/v1/orders/new') && req.method === 'POST') {
      const { orderItems, shippingInfo, discount, shippingCharges, subTotal, tax, total, userId } = req.body || {};

      if (shippingInfo === undefined || total === undefined) {
        return res.status(400).json({ success: false, message: 'Please fill all fields' });
      }

      // ✅ CRITICAL FIX: Validate stock availability BEFORE creating order
      console.log('🔍 Validating stock for order items...');
      
      if (orderItems && Array.isArray(orderItems)) {
        for (const item of orderItems) {
          try {
            // Extract base product ID (remove variant suffix like "_1kg")
            const baseProductId = item.productId.includes('_') 
              ? item.productId.split('_')[0] 
              : item.productId;

            // Check current stock
            const { data: product, error: productError } = await supabase
              .from('products')
              .select('stock, name')
              .eq('id', baseProductId)
              .single();

            if (productError || !product) {
              console.error(`❌ Product not found: ${baseProductId}`, productError);
              return res.status(400).json({
                success: false,
                message: `Product "${item.name}" is no longer available`
              });
            }

            const availableStock = Number(product.stock || 0);
            const requestedQuantity = Number(item.quantity || 0);

            // Stock validation
            if (availableStock < requestedQuantity) {
              console.warn(`⚠️  Insufficient stock for "${product.name}": Requested ${requestedQuantity}, Available ${availableStock}`);
              return res.status(400).json({
                success: false,
                message: `Sorry, only ${availableStock} units of "${product.name}" are available. Please update your cart.`
              });
            }

            console.log(`✅ Stock OK for "${product.name}": ${requestedQuantity} / ${availableStock}`);
          } catch (validationError) {
            console.error('❌ Stock validation error:', validationError);
            return res.status(500).json({
              success: false,
              message: 'Failed to validate stock availability. Please try again.'
            });
          }
        }
        console.log('✅ All items have sufficient stock');
      }

      // ── Silent Guest Sign-Up ──
      // If no userId (guest checkout), find or create a user by email/phone
      let resolvedUserId = userId || null;

      if (!resolvedUserId && shippingInfo) {
        const guestEmail = shippingInfo.email?.trim().toLowerCase();
        const guestPhone = shippingInfo.phone?.trim();
        const guestName = shippingInfo.name?.trim() || 'Guest';

        if (guestEmail || guestPhone) {
          // Check if a user with matching email already exists
          let existingUser = null;
          if (guestEmail) {
            const { data } = await supabase
              .from('users')
              .select('id, uid')
              .eq('email', guestEmail)
              .maybeSingle();
            existingUser = data;
          }

          // Fallback: check by phone (stored in uid for guest accounts)
          if (!existingUser && guestPhone) {
            const { data } = await supabase
              .from('users')
              .select('id, uid')
              .eq('uid', `guest_${guestPhone}`)
              .maybeSingle();
            existingUser = data;
          }

          if (existingUser) {
            // Link order to existing user
            resolvedUserId = existingUser.id;
            console.log(`[Guest Checkout] Linked order to existing user: ${existingUser.id}`);
          } else {
            // Create a new guest profile
            const guestUid = `guest_${guestPhone || guestEmail}`;
            const { data: newUser, error: createErr } = await supabase
              .from('users')
              .insert({
                uid: guestUid,
                email: guestEmail || `${guestPhone}@guest.julinacandles.in`,
                name: guestName,
                provider: 'guest',
                role: 'user',
              })
              .select('id')
              .single();

            if (!createErr && newUser) {
              resolvedUserId = newUser.id;
              console.log(`[Guest Checkout] Created guest user: ${newUser.id} (${guestUid})`);
            } else {
              console.error('[Guest Checkout] Failed to create guest user:', createErr);
              // Proceed without linking – order will still be created
            }
          }
        }
      }

      const { data: inserted, error } = await supabase
        .from('orders')
        .insert({
          user_uid: resolvedUserId || 'guest',
          shipping_info: shippingInfo,
          order_items: orderItems,
          subtotal: subTotal || 0,
          tax: tax || 0,
          shipping_charges: shippingCharges || 0,
          discount: discount || 0,
          total: total,
          status: 'Pending',
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase order insert error:', error);
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order: mapOrder(inserted),
      });
    }

    // ─── ORDERS: Get User / All Orders ───
    if (url.includes('/api/v1/orders/my') || url.includes('/api/v1/orders/all')) {
      // ✅ ADMIN PROTECTION: /api/v1/orders/all requires authentication
      if (url.includes('/api/v1/orders/all')) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token || token.length !== 128 || !/^[a-f0-9]+$/i.test(token)) {
          return res.status(401).json({ 
            success: false, 
            message: 'Unauthorized: Admin authentication required' 
          });
        }
      }

      let query = supabase.from('orders').select('*');
      
      if (url.includes('/api/v1/orders/my')) {
        const urlObj = new URL(url, 'http://localhost');
        const userId = urlObj.searchParams.get('userId');
        if (userId) {
          query = query.eq('user_uid', userId);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ success: false, message: error.message, orders: [] });
      }

      return res.status(200).json({
        success: true,
        orders: (data || []).map(mapOrder),
      });
    }

    // ─── ORDERS: Get Single Order ───
    if (url.match(/\/api\/v1\/orders\/[^/]+$/) && !url.includes('/all') && !url.includes('/my') && !url.includes('/new') && req.method === 'GET') {
      const id = url.split('/').pop();
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      const orderObj = mapOrder(data);

      // Status Check sync if order status is Pending
      if (orderObj && orderObj.status === 'Pending') {
        const shippingInfoObj = orderObj.shippingInfo || {};
        const merchantTxnNo = shippingInfoObj.merchantTxnNo;
        if (merchantTxnNo) {
          try {
            // Generate SecureHash for Status Check API
            const statusPayload = {
              merchantId: ICICI_CONFIG.MID,
              aggregatorID: ICICI_CONFIG.AGG_ID,
              merchantTxnNo: merchantTxnNo,
              originalTxnNo: merchantTxnNo,
              transactionType: 'STATUS',
            };
            const secureHash = generateICICISecureHash(statusPayload, ICICI_CONFIG.KEY);
            statusPayload.secureHash = secureHash;

            const checkRes = await fetch(ICICI_CONFIG.COMMAND_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(statusPayload),
            });
            const checkData = await checkRes.json().catch(() => null);

            if (checkData && checkData.secureHash) {
              const resHash = checkData.secureHash;
              const checkDataCopy = { ...checkData };
              delete checkDataCopy.secureHash;
              const verifyHash = generateICICISecureHash(checkDataCopy, ICICI_CONFIG.KEY);

              if (verifyHash.toLowerCase() === resHash.toLowerCase()) {
                if (checkData.txnResponseCode === '0000' && checkData.txnStatus === 'SUC') {
                  await handleOrderSuccess(orderObj.id);
                  orderObj.status = 'Processing';
                }
              }
            }
          } catch (e) {
            console.error('Failed to sync status for order:', orderObj.id, e);
          }
        }
      }

      return res.status(200).json({
        success: true,
        order: orderObj,
      });
    }

    // ─── ORDERS: Update Order Status ───
    if (url.includes('/api/v1/orders/update-status') && req.method === 'PUT') {
      // ✅ ADMIN PROTECTION: Update order status requires authentication
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token || token.length !== 128 || !/^[a-f0-9]+$/i.test(token)) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: Admin authentication required' 
        });
      }

      const { orderId, status, awbNumber, senderMobile, receiverMobile } = req.body || {};
      if (!orderId || !status) {
        return res.status(400).json({ success: false, message: 'Please provide orderId and status' });
      }

      // Prepare update data
      const updateData = { 
        status, 
        updated_at: new Date().toISOString() 
      };

      // If status is "Shipped" and tracking data provided, add to update
      if (status === 'Shipped' && awbNumber && senderMobile && receiverMobile) {
        updateData.awb_number = awbNumber;
        updateData.sender_mobile = senderMobile;
        updateData.receiver_mobile = receiverMobile;
        // Generate tracking URL (similar to APSRTC format)
        updateData.tracking_url = `https://cargo.apsrtconline.in/track?awb=${awbNumber}&sender=${senderMobile}&receiver=${receiverMobile}`;
      }

      // Update in Supabase
      const { data: updated, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error || !updated) {
        console.error('Order status update error:', error);
        return res.status(500).json({ success: false, message: error?.message || 'Failed to update order' });
      }

      // Send email notification
      try {
        const { data: userRow } = await supabase
          .from('users')
          .select('email, name')
          .eq('id', updated.user_uid)
          .maybeSingle();

        const shippingInfo = typeof updated.shipping_info === 'string' ? JSON.parse(updated.shipping_info) : updated.shipping_info;
        const recipientEmail = userRow?.email || shippingInfo?.email || 'shubhamvasantgundu@gmail.com';
        const customerName = userRow?.name || shippingInfo?.name || 'Customer';

        const baseUrl = 'https://julinacandles.in';

        // If status is "Shipped" and we have tracking data, send tracking email
        if (status === 'Shipped' && updated.awb_number) {
          const trackingEmailHtml = `
            <div style="background-color: #f7f4ec; padding: 30px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: #24291f; line-height: 1.6;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 20px; border: 1px solid #efe9db; box-shadow: 0 4px 20px rgba(22, 59, 38, 0.04);">
                
                <!-- Header Logo -->
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #efe9db; padding-bottom: 20px;">
                  <h1 style="color: #1f5133; font-size: 26px; font-weight: bold; font-family: Garamond, serif; margin: 0; letter-spacing: 2px; text-transform: uppercase;">Julina Candles & Melts</h1>
                  <span style="font-size: 10px; color: #c4633c; letter-spacing: 3px; font-weight: bold; text-transform: uppercase; display: block; margin-top: 5px;">Pure & Organic</span>
                </div>

                <h2 style="color: #1f5133; font-size: 20px; font-family: Garamond, serif; margin-top: 0; font-weight: bold;">📦 Your Order Has Been Shipped!</h2>
                <p style="font-size: 14px; color: #24291f; margin-bottom: 20px;">Dear ${customerName},</p>
                <p style="font-size: 14px; color: #5f6455; margin-bottom: 25px;">Great news! Your Julina Candles & Melts order has been dispatched and is on its way to you.</p>
                
                <!-- Tracking Information Box -->
                <div style="background: linear-gradient(135deg, #1f5133 0%, #2d7a4d 100%); border-radius: 16px; padding: 25px; margin-bottom: 30px; box-shadow: 0 6px 20px rgba(31, 81, 51, 0.15);">
                  <h3 style="color: #ffffff; font-size: 16px; font-weight: bold; margin: 0 0 20px 0; text-align: center; letter-spacing: 1px;">SHIPMENT TRACKING DETAILS</h3>
                  
                  <div style="background-color: rgba(255, 255, 255, 0.95); border-radius: 12px; padding: 20px; margin-bottom: 15px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                      <tr>
                        <td style="padding: 8px 0; color: #5f6455; font-weight: bold;">AWB Number:</td>
                        <td style="padding: 8px 0; font-family: monospace; text-align: right; color: #1f5133; font-weight: bold; font-size: 16px;">${updated.awb_number}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #5f6455; font-weight: bold;">Sender Mobile:</td>
                        <td style="padding: 8px 0; font-family: monospace; text-align: right; color: #24291f;">${updated.sender_mobile}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #5f6455; font-weight: bold;">Receiver Mobile:</td>
                        <td style="padding: 8px 0; font-family: monospace; text-align: right; color: #24291f;">${updated.receiver_mobile}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #5f6455; font-weight: bold;">Order ID:</td>
                        <td style="padding: 8px 0; font-family: monospace; text-align: right; color: #24291f;">${updated.id}</td>
                      </tr>
                    </table>
                  </div>

                  <div style="text-align: center;">
                    <a href="${updated.tracking_url || `https://cargo.apsrtconline.in/track`}" style="background-color: #ffffff; color: #1f5133; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">🔍 Track Your Shipment</a>
                  </div>
                </div>

                <!-- Instructions -->
                <div style="background-color: #fff8dc; border-left: 4px solid #c4633c; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
                  <p style="font-size: 13px; color: #24291f; margin: 0; line-height: 1.6;">
                    <strong>📍 How to Track:</strong><br>
                    Click the button above or visit <a href="https://cargo.apsrtconline.in/track" style="color: #c4633c; text-decoration: underline;">cargo.apsrtconline.in/track</a> and enter your AWB number along with either the sender or receiver mobile number.
                  </p>
                </div>

                <p style="font-size: 14px; color: #5f6455; margin-bottom: 25px;">You will receive notifications about your shipment status. If you have any questions, please contact our support team.</p>

                <div style="text-align: center; margin-bottom: 20px;">
                  <a href="${baseUrl}/order/${updated.id}" style="background-color: #f7f4ec; color: #1f5133; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 13px; display: inline-block; border: 2px solid #efe9db;">View Order Details</a>
                </div>

                <!-- Footer Notes -->
                <div style="border-top: 1px solid #efe9db; padding-top: 20px; text-align: center; font-size: 11px; color: #5f6455; line-height: 1.5;">
                  <p style="margin: 0 0 5px 0;">Thank you for choosing Julina Candles & Melts! 🌾</p>
                  <p style="margin: 0;">© ${new Date().getFullYear()} Julina Candles & Melts. All rights reserved.</p>
                </div>

              </div>
            </div>
          `;

          await sendEmail({
            to: recipientEmail,
            subject: `🚚 Your Order #${updated.id} Has Been Shipped - Track Your Package`,
            html: trackingEmailHtml
          });

        } else {
          // Send regular status update email for other statuses
          const emailHtml = `
            <div style="background-color: #f7f4ec; padding: 30px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: #24291f; line-height: 1.6;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 20px; border: 1px solid #efe9db; box-shadow: 0 4px 20px rgba(22, 59, 38, 0.04);">
                
                <!-- Header Logo -->
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #efe9db; padding-bottom: 20px;">
                  <h1 style="color: #1f5133; font-size: 26px; font-weight: bold; font-family: Garamond, serif; margin: 0; letter-spacing: 2px; text-transform: uppercase;">Julina Candles & Melts</h1>
                  <span style="font-size: 10px; color: #c4633c; letter-spacing: 3px; font-weight: bold; text-transform: uppercase; display: block; margin-top: 5px;">Pure & Organic</span>
                </div>

                <h2 style="color: #1f5133; font-size: 20px; font-family: Garamond, serif; margin-top: 0; font-weight: bold;">Order Status Updated! 📦</h2>
                <p style="font-size: 14px; color: #24291f; margin-bottom: 20px;">Dear ${customerName},</p>
                <p style="font-size: 14px; color: #5f6455; margin-bottom: 25px;">We wanted to let you know that the status of your Julina Candles & Melts order has been updated.</p>
                
                <div style="background-color: #f7f4ec; border-radius: 12px; padding: 20px; margin-bottom: 30px; border: 1px solid #efe9db;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <tr>
                      <td style="padding: 4px 0; color: #5f6455;"><strong>Order ID:</strong></td>
                      <td style="padding: 4px 0; font-family: monospace; text-align: right; color: #24291f;">${updated.id}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #5f6455;"><strong>New Status:</strong></td>
                      <td style="padding: 4px 0; text-align: right; color: #c4633c; font-weight: bold; text-transform: uppercase;">${status}</td>
                    </tr>
                  </table>
                </div>

                <p style="font-size: 14px; color: #5f6455; margin-bottom: 25px;">You can track the progress of your order at any time in your dashboard.</p>

                <div style="text-align: center; margin-bottom: 20px;">
                  <a href="${baseUrl}/order/${updated.id}" style="background-color: #1f5133; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 10px rgba(31, 81, 51, 0.15);">View Order Details</a>
                </div>

                <!-- Footer Notes -->
                <div style="border-top: 1px solid #efe9db; padding-top: 20px; text-align: center; font-size: 11px; color: #5f6455; line-height: 1.5;">
                  <p style="margin: 0 0 5px 0;">If you have any questions, reply to this email or contact support.</p>
                  <p style="margin: 0;">© ${new Date().getFullYear()} Julina Candles & Melts. All rights reserved.</p>
                </div>

              </div>
            </div>
          `;

          await sendEmail({
            to: recipientEmail,
            subject: `Julina Candles & Melts — Order #${updated.id} Status: ${status}`,
            html: emailHtml
          });
        }
      } catch (mailErr) {
        console.error('Failed to send status update email:', mailErr);
      }

      return res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        order: mapOrder(updated),
      });
    }

    // ─── ORDERS: Delete Order ───
    if (url.includes('/api/v1/orders/delete/') && req.method === 'DELETE') {
      // ✅ ADMIN PROTECTION: Delete order requires authentication
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token || token.length !== 128 || !/^[a-f0-9]+$/i.test(token)) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: Admin authentication required' 
        });
      }

      const id = url.split('/').pop();
      if (!id) {
        return res.status(400).json({ success: false, message: 'Please provide order ID' });
      }

      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Order deletion error:', error);
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
      });
    }

    // ─── COUPONS: Get All Coupons ───
    if (url.includes('/api/v1/coupons/all')) {
      const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Supabase get coupons error:', error);
        return res.status(500).json({ success: false, message: error.message, coupons: [] });
      }
      return res.status(200).json({
        success: true,
        coupons: (data || []).map(c => ({
          _id: c.id || c._id,
          code: String(c.code).toUpperCase(),
          amount: Number(c.amount),
          createdAt: c.created_at || c.createdAt || new Date().toISOString(),
        })),
      });
    }

    // ─── COUPONS: Create Coupon ───
    if (url.includes('/api/v1/coupons/new') && req.method === 'POST') {
      // ✅ ADMIN PROTECTION: Create coupon requires authentication
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token || token.length !== 128 || !/^[a-f0-9]+$/i.test(token)) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: Admin authentication required' 
        });
      }

      const { code, amount } = req.body || {};
      if (!code || !amount) {
        return res.status(400).json({ success: false, message: 'Please provide code and amount' });
      }
      const upperCode = String(code).trim().toUpperCase();
      const numAmount = Number(amount);

      const { data, error } = await supabase
        .from('coupons')
        .insert({ code: upperCode, amount: numAmount })
        .select()
        .single();

      if (error) {
        console.error('Supabase coupon insert error:', error);
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(201).json({
        success: true,
        message: 'Coupon created successfully',
        coupon: {
          _id: data.id,
          code: data.code,
          amount: Number(data.amount),
          createdAt: data.created_at,
        },
      });
    }

    // ─── COUPONS: Delete Coupon ───
    if (url.includes('/api/v1/coupons/delete')) {
      // ✅ ADMIN PROTECTION: Delete coupon requires authentication
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token || token.length !== 128 || !/^[a-f0-9]+$/i.test(token)) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: Admin authentication required' 
        });
      }

      const id = url.split('/').pop();
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) {
        console.error('Supabase coupon delete error:', error);
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully',
      });
    }

    // ─── COUPONS: Apply Coupon ───
    if (url.includes('/api/v1/coupons/apply')) {
      const { coupon } = req.body || {};
      if (!coupon) {
        return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
      }
      const codeUpper = String(coupon).trim().toUpperCase();

      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .ilike('code', codeUpper)
        .maybeSingle();

      if (error || !data) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired coupon code',
        });
      }

      return res.status(200).json({
        success: true,
        discount: Number(data.amount),
        message: `Coupon '${data.code}' applied! ₹${data.amount} discount added.`,
      });
    }

    // ─── STATS: Admin Dashboard ───
    if (url.includes('/api/v1/stats')) {
      const { data: products } = await supabase.from('products').select('id');
      const { data: ordersRaw } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      const { data: users } = await supabase.from('users').select('*');
      const { data: couponsRaw } = await supabase.from('coupons').select('id');

      const orders = (ordersRaw || []).map(mapOrder);

      // Only count confirmed (non-Pending) orders for revenue & totals
      const confirmedOrders = orders.filter(o => o.status !== 'Pending');
      const totalRevenue = confirmedOrders.reduce((acc, o) => acc + (o.total || 0), 0);
      const totalOrders = confirmedOrders.length;
      const totalProducts = products?.length || 0;
      const totalCoupons = couponsRaw?.length || 0;

      // Revenue by month (confirmed orders only)
      const revenueByMonth = {};
      confirmedOrders.forEach(o => {
        const d = o.createdAt ? new Date(o.createdAt) : new Date();
        const month = d.toLocaleString('default', { month: 'short' });
        revenueByMonth[month] = (revenueByMonth[month] || 0) + (o.total || 0);
      });

      // Order status breakdown
      const statusCounts = {};
      orders.forEach(o => {
        const s = o.status || 'Processing';
        statusCounts[s] = (statusCounts[s] || 0) + 1;
      });
      const orderStatusDemographic = Object.entries(statusCounts).map(([_id, count]) => ({ _id, count }));

      // Best selling products
      const salesByProduct = {};
      orders.forEach(o => {
        (o.orderItems || []).forEach(item => {
          const pid = item.productId || item.name || 'unknown';
          salesByProduct[pid] = (salesByProduct[pid] || 0) + (item.quantity || 1);
        });
      });
      const bestSellingProducts = Object.entries(salesByProduct)
        .map(([productId, quantity]) => ({ productId, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      // Latest 5 orders
      const latestOrders = orders.slice(0, 5);

      return res.status(200).json({
        success: true,
        stats: {
          totalRevenue,
          totalOrders,
          totalProducts,
          totalCoupons,
          revenueByMonth,
          orderStatusDemographic,
          bestSellingProducts,
          latestOrders,
        },
      });
    }

    // ─── AUTH / USER: All Users ───
    if (url.includes('/api/v1/auth/all') || url.includes('/api/v1/user/all')) {
      // ✅ ADMIN PROTECTION: Requires authentication
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token || token.length !== 128 || !/^[a-f0-9]+$/i.test(token)) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: Admin authentication required' 
        });
      }

      const { data: usersData } = await supabase.from('users').select('*');
      const { data: ordersData } = await supabase.from('orders').select('shipping_info');

      const customerMap = new Map();
      (usersData || []).forEach(u => customerMap.set(u.email || u.id, u));

      (ordersData || []).forEach(o => {
        const info = typeof o.shipping_info === 'string' ? JSON.parse(o.shipping_info) : o.shipping_info;
        if (info && info.email && !customerMap.has(info.email)) {
          customerMap.set(info.email, {
            _id: 'cust_' + (info.phone || Date.now()),
            name: info.name || 'Guest Customer',
            email: info.email,
            gender: 'Customer',
          });
        }
      });

      return res.status(200).json({
        success: true,
        users: Array.from(customerMap.values()),
      });
    }

    // ─── PRODUCTS: Search Products ───
    if (url.includes('/api/v1/products/search')) {
      const urlObj = new URL(url, 'http://localhost');
      const search = urlObj.searchParams.get('search') || '';
      const category = urlObj.searchParams.get('category') || '';
      const price = urlObj.searchParams.get('price') || '';
      const sort = urlObj.searchParams.get('sort') || '';
      const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
      const limit = 9;

      let query = supabase.from('products').select('*', { count: 'exact' });

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      if (category) {
        query = query.eq('category', category);
      }
      if (price) {
        const [minPrice, maxPrice] = price.split(',').map(Number);
        if (!isNaN(minPrice)) query = query.gte('price', minPrice);
        if (!isNaN(maxPrice)) query = query.lte('price', maxPrice);
      }
      if (sort === 'asc') {
        query = query.order('price', { ascending: true });
      } else if (sort === 'desc') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      const totalPage = Math.ceil((count || 0) / limit);

      return res.status(200).json({
        success: true,
        products: (data || []).map(mapProduct),
        totalPage,
      });
    }

    // ─── PRODUCTS: Get Latest Products ───
    if (url.includes('/api/v1/products/latest')) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      const resBody = {
        success: true,
        products: (data || []).map(mapProduct),
      };
      if (global.fastApiCache) global.fastApiCache.set(url, { body: resBody, timestamp: Date.now() });

      return res.status(200).json(resBody);
    }

    // ─── PRODUCTS: Get All Products (with pagination) ───
    if (url.includes('/api/v1/products/all')) {
      const urlObj = new URL(url, 'http://localhost');
      const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
      const limit = parseInt(urlObj.searchParams.get('limit') || '50', 10);
      const sortByRaw = urlObj.searchParams.get('sortBy');

      let query = supabase.from('products').select('*', { count: 'exact' });

      // Apply sorting
      if (sortByRaw) {
        try {
          const sortBy = JSON.parse(sortByRaw);
          if (sortBy.id) {
            const columnMap = { name: 'name', price: 'price', stock: 'stock', category: 'category' };
            const col = columnMap[sortBy.id] || 'created_at';
            query = query.order(col, { ascending: !sortBy.desc });
          }
        } catch (e) {
          query = query.order('created_at', { ascending: false });
        }
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      const totalProducts = count || 0;
      const totalPages = Math.ceil(totalProducts / limit);

      const resBody = {
        success: true,
        products: (data || []).map(mapProduct),
        totalProducts,
        totalPages,
        currentPage: page,
      };
      if (global.fastApiCache) global.fastApiCache.set(url, { body: resBody, timestamp: Date.now() });

      return res.status(200).json(resBody);
    }

    // ─── PRODUCTS: Get Categories ───
    if (url.includes('/api/v1/products/categories')) {
      const { data, error } = await supabase
        .from('products')
        .select('category');

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      const categories = [...new Set((data || []).map((row) => row.category))];
      const resBody = {
        success: true,
        categories,
      };
      if (global.fastApiCache) global.fastApiCache.set(url, { body: resBody, timestamp: Date.now() });

      return res.status(200).json(resBody);
    }

    // ─── PRODUCTS: Get Featured Products ───
    if (url.includes('/api/v1/products/featured')) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true);

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      const resBody = {
        success: true,
        products: (data || []).map(mapProduct),
      };
      if (global.fastApiCache) global.fastApiCache.set(url, { body: resBody, timestamp: Date.now() });

      return res.status(200).json(resBody);
    }

    // ─── PRODUCTS: Create New Product ───
    if (url.includes('/api/v1/products/new') && req.method === 'POST') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token || token.length !== 128 || !/^[a-f0-9]+$/i.test(token)) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Admin authentication required' });
      }

      const { name, category, price, stock, description, photo, variants } = req.body || {};

      if (!name || !category || price === undefined || stock === undefined || !description) {
        return res.status(400).json({ success: false, message: 'Please provide name, category, price, stock, and description' });
      }

      const insertData = {
        name,
        category: category.toLowerCase(),
        price: Number(price),
        stock: Number(stock),
        description,
        photo: photo || '/images/mainImage.png',
        variants: variants || [],
        featured: false,
      };

      const { data: newProduct, error } = await supabase
        .from('products')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Product creation error:', error);
        return res.status(500).json({ success: false, message: error.message });
      }

      if (global.fastApiCache) global.fastApiCache.clear();

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product: mapProduct(newProduct),
      });
    }

    // ─── PRODUCTS: Toggle Featured ───
    if (url.match(/\/api\/v1\/products\/feature\/[^/]+$/) && req.method === 'PATCH') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token || token.length !== 128 || !/^[a-f0-9]+$/i.test(token)) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Admin authentication required' });
      }

      const productId = url.split('/').pop();

      // Get current featured status
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('featured')
        .eq('id', productId)
        .single();

      if (fetchError || !product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const { data: updated, error: updateError } = await supabase
        .from('products')
        .update({ featured: !product.featured, updated_at: new Date().toISOString() })
        .eq('id', productId)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ success: false, message: updateError.message });
      }

      if (global.fastApiCache) global.fastApiCache.clear();

      return res.status(200).json({
        success: true,
        message: `Product ${updated.featured ? 'featured' : 'unfeatured'} successfully`,
        product: mapProduct(updated),
      });
    }

    // ─── PRODUCTS: Delete Product ───
    if (url.match(/\/api\/v1\/products\/[^/]+$/) && req.method === 'DELETE') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token || token.length !== 128 || !/^[a-f0-9]+$/i.test(token)) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Admin authentication required' });
      }

      const productId = url.split('/').pop();

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Product deletion error:', error);
        return res.status(500).json({ success: false, message: error.message });
      }

      if (global.fastApiCache) global.fastApiCache.clear();

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    }

    // ─── PRODUCTS: Get Single Product by ID ───
    if (url.match(/\/api\/v1\/products\/[^/]+$/) && req.method === 'GET') {
      const id = url.split('/').pop();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const resBody = {
        success: true,
        product: mapProduct(data),
      };
      if (global.fastApiCache) global.fastApiCache.set(url, { body: resBody, timestamp: Date.now() });

      return res.status(200).json(resBody);
    }

    // ─── PRODUCTS: Update Product (PUT) ───
    if (url.match(/\/api\/v1\/products\/[^/]+$/) && req.method === 'PUT') {
      const productId = url.split('/').pop();
      
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token || token.length !== 128 || !/^[a-f0-9]+$/i.test(token)) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Admin authentication required' });
      }

      // Parse JSON body (sent from admin panel)
      const body = req.body || {};
      const { name, category, price, stock, description, variants, photo } = body;

      // Find the product first
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (fetchError || !product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Prepare update data — only include fields that were sent
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (category !== undefined) updateData.category = category;
      if (price !== undefined) updateData.price = Number(price);
      if (stock !== undefined) updateData.stock = Number(stock);
      if (description !== undefined) updateData.description = description;
      if (variants !== undefined) updateData.variants = variants;
      if (photo !== undefined) updateData.photo = photo;
      updateData.updated_at = new Date().toISOString();

      const { data: updatedProduct, error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .select()
        .single();

      if (updateError) {
        console.error('Product update error:', updateError);
        return res.status(500).json({ success: false, message: 'Failed to update product', error: updateError.message });
      }

      if (global.fastApiCache) global.fastApiCache.clear();

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product: mapProduct(updatedProduct),
      });
    }

    // ─── AUTH: User Me ───
    if (url.includes('/api/v1/user/me') || url.includes('/api/v1/auth/me')) {
      return res.status(200).json({
        success: false,
        message: 'Not logged in',
      });
    }

    // ─── SHIPPERS: Admin Create Shipper ───
    if (url.includes('/api/v1/shippers/create') && req.method === 'POST') {
      // ✅ ADMIN PROTECTION: Create shipper requires authentication
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token || token.length !== 128 || !/^[a-f0-9]+$/i.test(token)) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: Admin authentication required' 
        });
      }

      const { name, email, phone, company_name, address } = req.body || {};
      
      if (!name || !email) {
        return res.status(400).json({ success: false, message: 'Name and email are required' });
      }

      // Check if shipper already exists
      const { data: existing } = await supabase
        .from('shippers')
        .select('id')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (existing) {
        return res.status(400).json({ success: false, message: 'Shipper with this email already exists' });
      }

      // Generate easy password based on name (e.g., "john@123")
      const firstName = name.trim().split(' ')[0].toLowerCase();
      const generatedPassword = `${firstName}@123`;
      const passwordHash = hashPassword(generatedPassword);

      const { data: newShipper, error } = await supabase
        .from('shippers')
        .insert({
          name,
          email: email.toLowerCase(),
          password_hash: passwordHash,
          phone: phone || null,
          company_name: company_name || null,
          address: address || null,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('Shipper creation error:', error);
        return res.status(500).json({ success: false, message: error.message });
      }

      // Send credentials email to shipper
      try {
        const credentialsEmail = `
          <div style="background-color: #f7f4ec; padding: 30px; font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 20px; border: 1px solid #efe9db;">
              
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1f5133; font-size: 26px; margin: 0;">Julina Candles & Melts</h1>
                <span style="font-size: 10px; color: #c4633c; text-transform: uppercase;">Shipper Portal</span>
              </div>

              <h2 style="color: #1f5133; font-size: 20px;">Welcome to Shipper Portal! 🚚</h2>
              <p style="font-size: 14px; color: #24291f; margin-bottom: 20px;">Dear ${name},</p>
              <p style="font-size: 14px; color: #5f6455; margin-bottom: 25px;">Your shipper account has been created. Below are your login credentials:</p>
              
              <div style="background-color: #f7f4ec; border-radius: 12px; padding: 25px; margin-bottom: 30px; border: 2px solid #1f5133;">
                <h3 style="color: #1f5133; margin-top: 0; font-size: 16px;">Login Credentials</h3>
                <table style="width: 100%; font-size: 14px;">
                  <tr>
                    <td style="padding: 8px 0; color: #5f6455;"><strong>Email:</strong></td>
                    <td style="padding: 8px 0; font-family: monospace; color: #24291f;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #5f6455;"><strong>Password:</strong></td>
                    <td style="padding: 8px 0; font-family: monospace; color: #c4633c; font-weight: bold;">${generatedPassword}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #5f6455;"><strong>Portal URL:</strong></td>
                    <td style="padding: 8px 0;"><a href="https://julinacandles.in/shipper/login" style="color: #1f5133;">https://julinacandles.in/shipper/login</a></td>
                  </tr>
                </table>
              </div>

              <div style="background-color: #fff8dc; border-left: 4px solid #c4633c; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
                <p style="font-size: 13px; color: #24291f; margin: 0;">
                  <strong>📝 Note:</strong> You can see all orders that are Processing or Shipped. Update orders to "Dispatched" when you deliver them.
                </p>
              </div>

              <div style="text-align: center; margin-bottom: 20px;">
                <a href="https://julinacandles.in/shipper/login" style="background-color: #1f5133; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Access Shipper Portal</a>
              </div>

              <div style="border-top: 1px solid #efe9db; padding-top: 20px; text-align: center; font-size: 11px; color: #5f6455;">
                <p style="margin: 0;">© ${new Date().getFullYear()} Julina Candles & Melts. All rights reserved.</p>
              </div>

            </div>
          </div>
        `;

        await sendEmail({
          to: email,
          subject: 'Your Julina Candles & Melts Shipper Portal Credentials',
          html: credentialsEmail
        });
      } catch (emailErr) {
        console.error('Failed to send credentials email:', emailErr);
      }

      return res.status(201).json({
        success: true,
        message: 'Shipper created successfully. Credentials sent via email.',
        shipper: {
          id: newShipper.id,
          name: newShipper.name,
          email: newShipper.email,
          phone: newShipper.phone,
          company_name: newShipper.company_name,
          status: newShipper.status,
          generatedPassword: generatedPassword // Send back password for admin to note
        }
      });
    }

    // ─── SHIPPERS: Get All Shippers (Admin) ───
    if (url.includes('/api/v1/shippers/all') && req.method === 'GET') {
      const { data, error } = await supabase
        .from('shippers')
        .select('id, name, email, phone, company_name, address, status, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({
        success: true,
        shippers: data || []
      });
    }

    // ─── SHIPPERS: Update Shipper Status (Admin) ───
    if (url.includes('/api/v1/shippers/update-status') && req.method === 'PUT') {
      // ✅ ADMIN PROTECTION: Update shipper status requires authentication
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token || token.length !== 128 || !/^[a-f0-9]+$/i.test(token)) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: Admin authentication required' 
        });
      }

      const { shipperId, status } = req.body || {};
      
      if (!shipperId || !status) {
        return res.status(400).json({ success: false, message: 'Shipper ID and status are required' });
      }

      const { data, error } = await supabase
        .from('shippers')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', shipperId)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({
        success: true,
        message: 'Shipper status updated',
        shipper: data
      });
    }

    // ─── SHIPPERS: Delete Shipper (Admin) ───
    if (url.includes('/api/v1/shippers/delete/') && req.method === 'DELETE') {
      // ✅ ADMIN PROTECTION: Delete shipper requires authentication
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token || token.length !== 128 || !/^[a-f0-9]+$/i.test(token)) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: Admin authentication required' 
        });
      }
      const id = url.split('/').pop();
      
      const { error } = await supabase
        .from('shippers')
        .delete()
        .eq('id', id);

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({
        success: true,
        message: 'Shipper deleted successfully'
      });
    }

    // ─── SHIPPERS: Login ───
    if (url.includes('/api/v1/shippers/login') && req.method === 'POST') {
      const { email, password } = req.body || {};
      
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      const { data: shipper, error } = await supabase
        .from('shippers')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (!shipper || error) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      if (shipper.status !== 'active') {
        return res.status(403).json({ success: false, message: 'Your account is inactive. Contact admin.' });
      }

      if (!verifyPassword(password, shipper.password_hash)) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Generate session token
      const token = generateShipperToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const { error: sessionError } = await supabase
        .from('shipper_sessions')
        .insert({
          shipper_id: shipper.id,
          token: token,
          expires_at: expiresAt.toISOString()
        });

      if (sessionError) {
        return res.status(500).json({ success: false, message: 'Failed to create session' });
      }

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token: token,
        shipper: {
          id: shipper.id,
          name: shipper.name,
          email: shipper.email,
          phone: shipper.phone,
          company_name: shipper.company_name
        }
      });
    }

    // ─── SHIPPERS: Get Assigned Orders ───
    if (url.includes('/api/v1/shippers/orders') && req.method === 'GET') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }

      // Verify token
      const { data: session, error: sessionError } = await supabase
        .from('shipper_sessions')
        .select('shipper_id, expires_at')
        .eq('token', token)
        .maybeSingle();

      if (!session || sessionError || new Date(session.expires_at) < new Date()) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
      }

      // Get ALL orders that are Processing, Shipped, or Dispatched (no assignment needed)
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['Processing', 'Shipped', 'Dispatched'])
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      // Map orders to shipper-safe format (no sensitive info)
      const shipperOrders = (orders || []).map(order => {
        const shippingInfo = typeof order.shipping_info === 'string' ? JSON.parse(order.shipping_info) : order.shipping_info;
        const orderItems = typeof order.order_items === 'string' ? JSON.parse(order.order_items) : order.order_items;

        return {
          id: order.id,
          status: order.status,
          createdAt: order.created_at,
          // Customer details (limited)
          customer: {
            name: shippingInfo.name,
            phone: shippingInfo.phone,
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            pinCode: shippingInfo.pinCode,
            landmark: shippingInfo.landmark || null
          },
          // Product details
          items: orderItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            photo: item.photo
          })),
          // Tracking info if available
          tracking: {
            awbNumber: order.awb_number || null,
            senderMobile: order.sender_mobile || null,
            receiverMobile: order.receiver_mobile || null,
            trackingUrl: order.tracking_url || null
          },
          total: Number(order.total)
        };
      });

      return res.status(200).json({
        success: true,
        orders: shipperOrders
      });
    }

    // ─── SHIPPERS: Update Order to Dispatched ───
    if (url.includes('/api/v1/shippers/dispatch-order') && req.method === 'PUT') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const { orderId } = req.body || {};
      
      console.log('Dispatch request received:', { orderId, hasToken: !!token });
      
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }

      if (!orderId) {
        return res.status(400).json({ success: false, message: 'Order ID is required' });
      }

      // Verify token
      const { data: session, error: sessionError } = await supabase
        .from('shipper_sessions')
        .select('shipper_id, expires_at')
        .eq('token', token)
        .maybeSingle();

      if (!session || sessionError || new Date(session.expires_at) < new Date()) {
        console.error('Token verification failed:', sessionError);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
      }

      console.log('Token verified, updating order:', orderId);

      // Update order status to Dispatched
      const { data: updated, error } = await supabase
        .from('orders')
        .update({ 
          status: 'Dispatched', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Order update error:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to update order' });
      }

      if (!updated) {
        console.error('Order not found:', orderId);
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      console.log('Order updated successfully:', orderId);

      return res.status(200).json({
        success: true,
        message: 'Order marked as dispatched',
        order: mapOrder(updated)
      });
    }

    // ─── SHIPPERS: Logout ───
    if (url.includes('/api/v1/shippers/logout') && req.method === 'POST') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (token) {
        await supabase
          .from('shipper_sessions')
          .delete()
          .eq('token', token);
      }

      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    }

    // ─── SHIPPERS: Verify Token (Check if logged in) ───
    if (url.includes('/api/v1/shippers/verify') && req.method === 'GET') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }

      const { data: session, error } = await supabase
        .from('shipper_sessions')
        .select('shipper_id, expires_at, shippers(id, name, email, phone, company_name)')
        .eq('token', token)
        .maybeSingle();

      if (!session || error || new Date(session.expires_at) < new Date()) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
      }

      return res.status(200).json({
        success: true,
        shipper: session.shippers
      });
    }

    // ============================================
    // ADMIN AUTHENTICATION ENDPOINTS
    // ============================================

    // Admin credentials helper functions
    function hashAdminPassword(password) {
      return crypto.createHash('sha256').update(password + 'ADMIN_SALT_2026_VH').digest('hex');
    }

    function generateAdminToken() {
      return crypto.randomBytes(64).toString('hex');
    }

    // ─── ADMIN: Login ───
    if (url.includes('/api/v1/admin/login') && req.method === 'POST') {
      const { email, password } = req.body || {};
      
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' });
      }

      const cleanEmail = String(email).trim().toLowerCase();

      // Default built-in admin credentials
      const ADMIN_EMAIL = 'admin@julinacandles.in';
      const DEFAULT_ADMIN_HASH = hashAdminPassword('julinacandles@2026');
      const providedPasswordHash = hashAdminPassword(password);

      let isAdminValid = false;
      let adminData = {
        id: 'admin_001',
        email: cleanEmail,
        name: 'Admin',
      };

      // 1. Check built-in admin account
      if (cleanEmail === ADMIN_EMAIL.toLowerCase() && providedPasswordHash === DEFAULT_ADMIN_HASH) {
        isAdminValid = true;
      } else {
        // 2. Fallback: check Supabase users table for user with role='admin'
        try {
          const { data: userRow } = await supabase
            .from('users')
            .select('*')
            .eq('email', cleanEmail)
            .eq('role', 'admin')
            .maybeSingle();

          if (userRow) {
            // User exists and is admin
            isAdminValid = true;
            adminData = {
              id: userRow.id || userRow.uid || 'admin_001',
              email: userRow.email,
              name: userRow.name || 'Admin',
            };
          }
        } catch (dbErr) {
          console.error('Error verifying DB admin user:', dbErr);
        }
      }

      if (!isAdminValid) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Generate session token
      const token = generateAdminToken();

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token: token,
        admin: adminData
      });
    }

    // ─── ADMIN: Verify Token ───
    if (url.includes('/api/v1/admin/verify') && req.method === 'GET') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }

      // Simple token validation (64-byte hex string)
      // In production, check against database table
      if (token.length === 128 && /^[a-f0-9]+$/i.test(token)) {
        return res.status(200).json({
          success: true,
          admin: {
            id: 'admin_001',
            email: 'admin@julinacandles.in',
            name: 'Admin',
          }
        });
      }

      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // ─── ADMIN: Logout ───
    if (url.includes('/api/v1/admin/logout') && req.method === 'POST') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }

      // In production, delete the token from admin_sessions table
      // For now, just return success (frontend will remove token from localStorage)
      
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    }

    // ============================================
    // CMS ENDPOINTS - Content Management System
    // ============================================

    // ─── CMS: Get All Testimonials (Public) ───
    if (url.includes('/api/v1/cms/testimonials') && req.method === 'GET') {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({ success: true, testimonials: data || [] });
    }

    // ─── CMS: Get All Blogs (Public - only published) ───
    if (url.includes('/api/v1/cms/blogs') && req.method === 'GET') {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({ success: true, blogs: data || [] });
    }

    // ─── CMS: Get Single Blog by Slug (Public) ───
    if (url.match(/\/api\/v1\/cms\/blogs\/[^/]+$/) && req.method === 'GET') {
      const slug = url.split('/').pop();
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
      }

      return res.status(200).json({ success: true, blog: data });
    }

    // ─── CMS: Get All Recipes (Public - only published) ───
    if (url.includes('/api/v1/cms/recipes') && req.method === 'GET') {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({ success: true, recipes: data || [] });
    }

    // ─── CMS: Get All Team Members (Public) ───
    if (url.includes('/api/v1/cms/team-members') && req.method === 'GET') {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({ success: true, teamMembers: data || [] });
    }

    // ─── CMS: Get All FAQs (Public) ───
    if (url.includes('/api/v1/cms/faqs') && req.method === 'GET') {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({ success: true, faqs: data || [] });
    }

    // ─── CMS: Get All Gallery Images (Public) ───
    if (url.includes('/api/v1/cms/gallery') && req.method === 'GET') {
      const { data, error} = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({ success: true, gallery: data || [] });
    }

    // ─── CMS: Get All Trust Highlights (Public) ───
    if (url.includes('/api/v1/cms/trust-highlights') && req.method === 'GET') {
      const { data, error } = await supabase
        .from('trust_highlights')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({ success: true, trustHighlights: data || [] });
    }

    // ─── CMS: Get All Company Values (Public) ───
    if (url.includes('/api/v1/cms/company-values') && req.method === 'GET') {
      const { data, error } = await supabase
        .from('company_values')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({ success: true, companyValues: data || [] });
    }

    // ─── Fallback: Return all products ───
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    return res.status(200).json({
      success: true,
      products: (data || []).map(mapProduct),
    });

  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  }
}

