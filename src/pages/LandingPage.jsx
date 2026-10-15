import React from 'react';
import { Link } from 'react-router-dom';
import {
  RotateCcw,
  Wallet,
  CheckSquare,
  BarChart3,
  ArrowRight,
  Sparkles,
  Users,
  ShieldCheck,
  Smile
} from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';
import PublicFooter from '../components/layout/PublicFooter';
import heroIllustration from '../assets/hero_illustration.jpg';

export default function LandingPage() {
  const featureCards = [
    {
      title: 'Fair Chore Rotation',
      description: 'Distribute chores fairly among household members.',
      icon: RotateCcw,
      bg: 'var(--color-lavender)',
      color: 'var(--color-lavender-text)',
    },
    {
      title: 'Shared Expenses',
      description: 'Split bills and track household spending.',
      icon: Wallet,
      bg: 'var(--color-mint)',
      color: 'var(--color-mint-text)',
    },
    {
      title: 'Task Tracking',
      description: 'Stay on top of pending and completed tasks.',
      icon: CheckSquare,
      bg: 'var(--color-peach)',
      color: 'var(--color-peach-text)',
    },
    {
      title: 'Household Insights',
      description: 'Visualize work and expense statistics.',
      icon: BarChart3,
      bg: 'var(--color-cream)',
      color: 'var(--color-cream-text)',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Create Your Space',
      desc: 'Set up your household in seconds and invite roommates via unique invite codes.',
    },
    {
      step: '02',
      title: 'Add Chores & Expenses',
      desc: 'List recurring household duties and log groceries, utility bills, or shared rent.',
    },
    {
      step: '03',
      title: 'Smart Fair Rotation',
      desc: 'Our deterministic engine balances workloads so no one person is stuck with dishes.',
    },
    {
      step: '04',
      title: 'Track & Celebrate',
      desc: 'Check off completions, see balances settle automatically, and enjoy harmonic living.',
    },
  ];

  return (
    <div className="public-shell">
      <PublicNavbar />

      <main style={{ flex: 1 }}>
        {/* HERO SECTION */}
        <section
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '56px 24px 48px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: 48,
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-lavender)',
                color: 'var(--color-primary-dark)',
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 20,
              }}
            >
              <Sparkles size={16} />
              <span>Smart Roommate Harmony</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(36px, 4.2vw, 54px)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: 'var(--color-text)',
                marginBottom: 20,
                letterSpacing: '-1.2px',
              }}
            >
              A fairer way to share your space.
            </h1>

            <p
              style={{
                fontSize: 17,
                color: 'var(--color-muted)',
                lineHeight: 1.6,
                marginBottom: 32,
                maxWidth: 480,
              }}
            >
              Manage chores, split expenses, and keep your household on the same page — all in one place.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <Link
                to="/register"
                className="btn btn-primary btn-pill btn-lg"
                style={{ padding: '14px 34px' }}
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="btn btn-secondary btn-pill btn-lg"
                style={{ padding: '14px 34px' }}
              >
                Login
              </Link>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: 540,
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--color-border)',
                background: '#FFFFFF',
              }}
            >
              <img
                src={heroIllustration}
                alt="Roommates happily sharing household chores together"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </section>

        {/* 4 PASTEL FEATURE CARDS */}
        <section
          id="features"
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '24px 24px 64px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20,
            }}
          >
            {featureCards.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  style={{
                    backgroundColor: feat.bg,
                    borderRadius: 'var(--radius-lg)',
                    padding: '28px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 14,
                    transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                    border: '1px solid rgba(0,0,0,0.03)',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: varRadius(feat.title),
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: feat.color,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                      {feat.title}
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          style={{
            backgroundColor: '#FAF9FE',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
            padding: '72px 24px',
          }}
        >
          <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary-dark)', letterSpacing: 1.2 }}>
              SIMPLE & EQUAL
            </span>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginTop: 8, marginBottom: 12 }}>
              How ChoreSync Works
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: 15, maxWidth: 540, margin: '0 auto' }}>
              Four easy steps to automate chore assignments and split shared bills without passive-aggressive notes.
            </p>
          </div>

          <div
            style={{
              maxWidth: 1280,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 24,
            }}
          >
            {steps.map((item) => (
              <div
                key={item.step}
                className="card"
                style={{
                  padding: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 28,
                    fontWeight: 800,
                    color: 'var(--color-primary)',
                  }}
                >
                  {item.step}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section
          id="about"
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '72px 24px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 12 }}>
              Why Roommates Love ChoreSync
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: 15 }}>
              Say goodbye to awkward chore meetings and uneven rent splits.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            <div className="card" style={{ padding: 28 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: 'var(--color-mint)',
                  color: 'var(--color-mint-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Smile size={24} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Zero Roommate Friction</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: 14, lineHeight: 1.6 }}>
                Clear assignments and automated notifications eliminate forgetfulness and resentment.
              </p>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: 'var(--color-lavender)',
                  color: 'var(--color-primary-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Transparent Shared Bills</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: 14, lineHeight: 1.6 }}>
                Track who paid for what and instantly know each person’s fair share and current balance.
              </p>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: 'var(--color-peach)',
                  color: 'var(--color-peach-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Mathematical Fairness</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: 14, lineHeight: 1.6 }}>
                Our rotation algorithms consider task difficulty and prior assignments to keep effort balanced.
              </p>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section
          style={{
            maxWidth: 1280,
            margin: '0 auto 64px',
            padding: '0 24px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-lavender)',
              borderRadius: 'var(--radius-xl)',
              padding: '56px 36px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              border: '1px solid rgba(155, 122, 232, 0.2)',
            }}
          >
            <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-text)' }}>
              Ready for a happier, harmonious household?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 16, maxWidth: 540 }}>
              Join thousands of roommates who manage their shared home with ChoreSync.
            </p>
            <Link
              to="/register"
              className="btn btn-primary btn-pill btn-lg"
              style={{ padding: '14px 36px', fontSize: 16 }}
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

function varRadius(title) {
  return '12px';
}
