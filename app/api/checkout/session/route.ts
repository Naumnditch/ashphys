import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.redirect(new URL('/signin', req.url));

  const form = await req.formData();
  const iso = String(form.get('datetime') || '');
  const datetime = new Date(iso);
  if (Number.isNaN(datetime.getTime())) {
    return NextResponse.json({ error: 'Invalid datetime' }, { status: 400 });
  }

  const booking = await db.booking.create({ data: { userId: session.user.id, datetime } });

  const checkout = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: 'Private Tutoring Session' },
          unit_amount: 6000,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?booking=${booking.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/book`,
  });

  await db.booking.update({ where: { id: booking.id }, data: { stripeId: checkout.id } });

  return NextResponse.redirect(checkout.url ?? '/book', { status: 303 });
}


