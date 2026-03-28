import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../../types';

interface CertificateDocumentProps {
    moduleTitle: string;
    user: User | null;
    date: string;
}

export const CertificateDocument = forwardRef<HTMLDivElement, CertificateDocumentProps>(({ moduleTitle, user, date }, ref) => {
    const { i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    // Clamp name font size so long names don't overflow
    const name = user?.name || 'Future CEO';
    const nameFontSize = name.length > 16 ? '3rem' : name.length > 10 ? '4rem' : '4.5rem';

    return (
        <div
            ref={ref}
            className="relative overflow-hidden shadow-2xl"
            style={{
                width: '794px',
                height: '1123px',         // Portrait A4 — matches template PNG aspect
                fontFamily: "'Times New Roman', serif",
                direction: isRtl ? 'rtl' : 'ltr',
                backgroundImage: 'url(/assets/certificate_template.png)',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundColor: '#fff',
            }}
        >
            {/* ── NAME ─────────────────────────────────────────────────────── */}
            {/* Sits right on the "presented to:" underline — ~44% down */}
            <div
                className="absolute left-1/2 -translate-x-1/2 text-center"
                style={{ top: '41%', width: '72%' }}
            >
                <span
                    className="font-bold text-gray-800"
                    style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: nameFontSize,
                        lineHeight: 1.1,
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {name}
                </span>
            </div>

            {/* ── MODULE TITLE ─────────────────────────────────────────────── */}
            {/* Blue bold text area ~60% down, left half only (owl is right) */}
            <div
                className="absolute text-center"
                style={{ top: '58%', left: '8%', width: '52%' }}
            >
                <span
                    className="font-black text-blue-700 uppercase tracking-wider"
                    style={{
                        fontFamily: 'Impact, sans-serif',
                        fontSize: moduleTitle.length > 22 ? '1.15rem' : '1.45rem',
                        letterSpacing: '0.08em',
                        display: 'block',
                    }}
                >
                    {moduleTitle}
                </span>
            </div>

            {/* ── OLLIE SIGNATURE ──────────────────────────────────────────── */}
            {/* Left column, above "Instructor Signature" label ~72% down */}
            <div
                className="absolute text-center"
                style={{ top: '70%', left: '8%', width: '38%' }}
            >
                <span
                    className="font-bold text-blue-700"
                    style={{
                        fontFamily: 'cursive',
                        fontSize: '2rem',
                        display: 'block',
                        transform: 'rotate(-6deg)',
                        transformOrigin: 'center',
                    }}
                >
                    Ollie Owl
                </span>
            </div>

            {/* ── DATE ─────────────────────────────────────────────────────── */}
            {/* Left column, above date underline ~82% down */}
            <div
                className="absolute text-center"
                style={{ top: '80%', left: '8%', width: '38%' }}
            >
                <span
                    className="font-bold text-gray-700"
                    style={{
                        fontFamily: 'monospace',
                        fontSize: '1.1rem',
                        display: 'block',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {date}
                </span>
            </div>
        </div>
    );
});

CertificateDocument.displayName = 'CertificateDocument';
