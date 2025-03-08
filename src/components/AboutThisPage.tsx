import React from 'react';
import { useTranslation } from 'react-i18next'; // Add this import

const AboutPage: React.FC = () => {
  const { t } = useTranslation(); // Add this hook

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-20">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Permanent+Marker&family=Shadows+Into+Light&family=Indie+Flower&family=Dancing+Script:wght@400;700&display=swap');
        `}
      </style>

      <h1
        className="text-6xl mb-16 text-center"
        style={{
          fontFamily: 'Permanent Marker, cursive',
          textShadow: '0 0 15px rgba(255,255,255,0.4)'
        }}
      >
        {t('about.whyThisExists')}
      </h1>

      <div className="max-w-3xl mx-auto space-y-12 text-xl">
        <p
          className="leading-relaxed"
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: '2.1rem',
            transform: 'rotate(-0.7deg)'
          }}
        >
          <span style={{ fontFamily: 'Shadows Into Light, cursive' }}></span>
          <span style={{ fontFamily: 'Indie Flower, cursive' }}>{t('about.myBlood')} </span>
        </p>

        <div
          className="p-6 border rounded-lg"
          style={{
            fontFamily: 'Shadows Into Light, cursive',
            borderColor: 'rgba(255,255,255,0.2)',
            transform: 'rotate(1.2deg)',
            fontSize: '1.8rem'
          }}
        >
          {t('about.methodologiesIrrelevant')} <span style={{ fontFamily: 'Permanent Marker, cursive' }}>{t('about.completelyIrrelevant')} </span>
          <span style={{ fontFamily: 'Caveat, cursive' }}> </span><br/>
          <span className="ml-8">→</span> {t('about.egoDeath')}<br/>
          <span className="ml-8">→</span> {t('about.digitalBrutalism')}<br/>
          <span className="ml-8">→</span> {t('about.philosophicalFragments')}<br/>
          <span className="ml-8">→</span> {t('about.softwareDemonicRituals')}
        </div>

        <p
          style={{
            fontFamily: 'Indie Flower, cursive',
            fontSize: '1.7rem',
            lineHeight: '1.8',
            textShadow: '0 0 8px rgba(255,255,255,0.2)'
          }}
        >
          <span style={{ fontFamily: 'Dancing Script, cursive' }}>{t('about.asEverythingWithLife')}</span>, {t('about.itsUnpolished')}.
          <span style={{ fontFamily: 'Permanent Marker, cursive' }}> {t('about.asEverySoftware')}</span> {t('about.foreverUnfinished')}
          <span style={{ fontFamily: 'Caveat, cursive' }}> {t('about.websitePreexists')}</span> {t('about.modernWebDev')}.
        </p>

        <div
          className="p-6 bg-black border-2 mt-16"
          style={{
            fontFamily: 'Shadows Into Light, cursive',
            borderColor: 'rgba(255,75,75,0.3)',
            transform: 'rotate(-2deg)'
          }}
        >
          <div className="text-center mb-4" style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '1.8rem' }}>
            ↗ {t('about.oopPatternsUsed')} ↗
          </div>
          <div className="text-center" style={{ fontFamily: 'Caveat, cursive', fontSize: '1.4rem' }}>
            {t('about.noSpookyCookies')}<br/>
            {t('about.noTimeStealingAds')}<br/>
            "{t('about.emptinessAsConcept')}"
          </div>
        </div>

        <div
          className="border-t pt-12 mt-20"
          style={{
            fontFamily: 'Indie Flower, cursive',
            borderColor: 'rgba(255,255,255,0.1)'
          }}
        >
          <h2 className="text-3xl mb-6" style={{ fontFamily: 'Permanent Marker, cursive' }}>{t('about.bloodComponents')}:</h2>
          <ul className="space-y-4 text-2xl pl-8">
            <li style={{ fontFamily: 'Caveat, cursive' }}>→ <span className="underline">{t('about.reanimatedCorpse')}</span> CV</li>
            <li style={{ fontFamily: 'Shadows Into Light, cursive' }}>→ {t('about.trauma')}</li>
            <li style={{ fontFamily: 'Dancing Script, cursive' }}>→ {t('about.lovePassion')}</li>
            <li style={{ fontFamily: 'Indie Flower, cursive' }}>→ {t('about.stolenTime')}</li>
            <li
              className="text-red-300"
              style={{
                fontFamily: 'Permanent Marker, cursive',
                textShadow: '0 0 10px rgba(255,0,0,0.3)'
              }}
            >
              → {t('about.fingerBleeding')}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
