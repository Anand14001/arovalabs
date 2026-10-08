import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, CalendarDays, CheckCircle2, Clock, Loader2, MapPin, Phone } from 'lucide-react';
import { checkoutApi, formatPaise } from '../lib/commerce';
import Reveal from '../components/motion/Reveal';

/*
 * /booking-confirmation/
 *
 * Reached with ?order=ARV-2026-00001&token=… — the token is what makes the page
 * readable without an account, and without it the API returns a 404 rather than
 * confirming the order number exists.
 *
 * The page tells the truth about two things the reference site glossed over:
 * whether the payment actually succeeded, and that the collection time is a
 * request the lab still has to confirm.
 */

const Row = ({ icon: Icon, label, children }) => (
  <div className="flex gap-3">
    <Icon size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink/40">{label}</p>
      <div className="text-sm text-ink">{children}</div>
    </div>
  </div>
);

export default function BookingConfirmation() {
  const [params] = useSearchParams();
  const orderNumber = params.get('order');
  const token = params.get('token');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['order', orderNumber, token],
    queryFn: () => checkoutApi.getOrder(orderNumber, token),
    enabled: Boolean(orderNumber && token),
    retry: false,
    // The webhook may land a moment after the browser does, so an unpaid-looking
    // order is re-checked a few times rather than being reported as failed.
    refetchInterval: (query) =>
      query.state.data?.order?.paymentStatus === 'PAID' ? false : 4000,
  });

  if (!orderNumber || !token) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="display-md text-ink">We need your booking reference</h1>
        <p className="section-sub mx-auto mt-2 max-w-md">
          Open the link from your confirmation email, or call us on{' '}
          <a href="tel:9442218998" className="text-brand underline">9442218998</a>.
        </p>
        <Link to="/" className="btn-outline mt-7 inline-flex">Back to home</Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="shell py-24 text-center">
        <Loader2 className="mx-auto size-6 animate-spin text-ink/30" aria-label="Loading" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="display-md text-ink">We couldn’t find that booking</h1>
        <p className="section-sub mx-auto mt-2 max-w-md">
          {error?.status === 404
            ? 'The link may be incomplete. Check your confirmation email, or call us and quote your reference.'
            : 'Something went wrong on our side. Please try again in a moment.'}
        </p>
        <a href="tel:9442218998" className="btn-brand mt-7 inline-flex">Call 9442218998</a>
      </div>
    );
  }

  const order = data.order;
  const paid = order.paymentStatus === 'PAID';

  const date = order.collection.requestedDate
    ? new Date(order.collection.requestedDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : null;

  return (
    <div className="shell py-10 sm:py-16">
      <Reveal className="mx-auto max-w-2xl text-center">
        {paid ? (
          <CheckCircle2 size={44} className="mx-auto text-brand" aria-hidden="true" />
        ) : (
          <AlertCircle size={44} className="mx-auto text-amber-500" aria-hidden="true" />
        )}

        <h1 className="display-md mt-4 text-ink">
          {paid ? 'Booking confirmed' : 'Booking received — payment pending'}
        </h1>

        <p className="section-sub mx-auto mt-2 max-w-lg">
          {paid
            ? 'We’ve got your booking. Our team will call to confirm the collection time.'
            : 'Your booking is saved, but we haven’t received the payment yet. If you were charged, this page will update on its own within a minute.'}
        </p>

        <p className="mt-5 inline-block rounded-full bg-brand-light px-5 py-2 text-sm font-bold tracking-wide text-brand">
          {order.orderNumber}
        </p>
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-base font-bold text-ink">Collection</h2>
          <div className="mt-4 space-y-4">
            <Row icon={CalendarDays} label="Requested date">
              {date ?? '—'}
            </Row>
            <Row icon={Clock} label="Requested time">
              {order.collection.requestedWindow
                ? `${order.collection.requestedWindow.start}–${order.collection.requestedWindow.end}`
                : '—'}
              {/* Stated again here, because this is the page people screenshot. */}
              <span className="mt-0.5 block text-xs text-body/70">
                We’ll call to confirm the exact time.
              </span>
            </Row>
            <Row icon={MapPin} label={order.collection.type === 'HOME' ? 'Collecting from' : 'Visiting'}>
              {order.collection.type === 'HOME' && order.address ? (
                <span>
                  {order.address.line1}
                  {order.address.landmark ? `, ${order.address.landmark}` : ''}
                  <br />
                  {order.address.city}, {order.address.state} {order.address.pincode}
                </span>
              ) : (
                order.collection.center?.name ?? '—'
              )}
            </Row>
            <Row icon={Phone} label="Contact">
              {order.contact.name} · {order.contact.phone}
            </Row>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-base font-bold text-ink">What you booked</h2>

          <ul className="mt-4 space-y-2.5 border-b border-ink/10 pb-4">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 text-ink">
                  {item.title}
                  {item.quantity > 1 && <span className="text-body/70"> × {item.quantity}</span>}
                </span>
                <span className="shrink-0 stat-figure text-ink">
                  {formatPaise(item.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 text-sm">
            {order.totals.discount > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-body">Discount {order.couponCode && `(${order.couponCode})`}</dt>
                <dd className="stat-figure text-brand">−{formatPaise(order.totals.discount)}</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between gap-4 border-t border-ink/10 pt-3">
              <dt className="font-bold text-ink">{paid ? 'Paid' : 'Payable'}</dt>
              <dd className="stat-figure text-xl font-bold text-ink">
                {formatPaise(order.totals.total)}
              </dd>
            </div>
          </dl>

          {order.patients.length > 0 && (
            <div className="mt-4 border-t border-ink/10 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink/40">
                {order.patients.length === 1 ? 'Patient' : 'Patients'}
              </p>
              <p className="mt-1 text-sm text-ink">
                {order.patients.map((p) => p.name).join(', ')}
              </p>
            </div>
          )}
        </section>
      </div>

      <div className="mx-auto mt-8 max-w-3xl text-center">
        <p className="text-sm text-body">
          Questions? Call{' '}
          <a href="tel:9442218998" className="font-semibold text-brand underline">
            9442218998
          </a>{' '}
          and quote <strong className="text-ink">{order.orderNumber}</strong>.
        </p>
        <Link to="/" className="btn-outline mt-5 inline-flex">Back to home</Link>
      </div>
    </div>
  );
}
