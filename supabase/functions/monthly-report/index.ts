import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── HTML Email Template ──────────────────────────────────────────────────────
function buildEmail(data: {
    parentName: string;
    kidName: string;
    month: string;
    xpEarned: number;
    level: number;
    bizCoins: number;
    lessonsCompleted: number;
    gigsCompleted: number;
    topAchievement: string;
    streakDays: number;
}): string {
    const {
        parentName, kidName, month, xpEarned, level,
        bizCoins, lessonsCompleted, gigsCompleted, topAchievement, streakDays
    } = data;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KidCapHQ Monthly Report</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4ff; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10); }
    .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 36px 32px; text-align: center; }
    .header h1 { color: #fff; margin: 0 0 4px; font-size: 26px; }
    .header p { color: rgba(255,255,255,0.8); margin: 0; font-size: 14px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); border-radius: 20px; padding: 4px 14px; color: #fff; font-size: 13px; margin-top: 12px; }
    .body { padding: 32px; }
    .greeting { font-size: 16px; color: #374151; margin-bottom: 24px; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 28px; }
    .stat-card { background: #f5f3ff; border-radius: 12px; padding: 16px 12px; text-align: center; }
    .stat-card .val { font-size: 28px; font-weight: 900; color: #4f46e5; margin: 0; }
    .stat-card .lbl { font-size: 11px; color: #6b7280; margin: 4px 0 0; }
    .section-title { font-size: 14px; font-weight: 700; color: #374151; margin: 24px 0 12px; text-transform: uppercase; letter-spacing: 0.05em; }
    .achievement { background: linear-gradient(90deg, #fef9c3, #fef08a); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .achievement .icon { font-size: 28px; }
    .achievement .text { font-size: 14px; color: #78350f; font-weight: 600; }
    .streak { background: linear-gradient(90deg, #fee2e2, #fecaca); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; gap: 12px; }
    .streak .icon { font-size: 28px; }
    .streak .text { font-size: 14px; color: #7f1d1d; font-weight: 600; }
    .cta { text-align: center; margin: 28px 0 8px; }
    .cta a { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 15px; display: inline-block; }
    .footer { background: #f9fafb; padding: 20px 32px; text-align: center; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>📊 Monthly Progress Report</h1>
      <p>${kidName}'s KidCapHQ Journey · ${month}</p>
      <span class="badge">Level ${level} CEO 🏆</span>
    </div>

    <div class="body">
      <p class="greeting">Hi ${parentName}! 👋<br/>Here's a summary of <strong>${kidName}</strong>'s business education progress this month.</p>

      <div class="stats-grid">
        <div class="stat-card">
          <p class="val">⚡${xpEarned.toLocaleString()}</p>
          <p class="lbl">XP Earned</p>
        </div>
        <div class="stat-card">
          <p class="val">🪙${bizCoins.toLocaleString()}</p>
          <p class="lbl">BizCoins</p>
        </div>
        <div class="stat-card">
          <p class="val">📚${lessonsCompleted}</p>
          <p class="lbl">Lessons Done</p>
        </div>
        <div class="stat-card">
          <p class="val">💼${gigsCompleted}</p>
          <p class="lbl">Gigs Completed</p>
        </div>
        <div class="stat-card">
          <p class="val">🔥${streakDays}</p>
          <p class="lbl">Day Streak</p>
        </div>
        <div class="stat-card">
          <p class="val">🎯${level}</p>
          <p class="lbl">CEO Level</p>
        </div>
      </div>

      <p class="section-title">🏆 Top Achievement</p>
      <div class="achievement">
        <span class="icon">🌟</span>
        <span class="text">${topAchievement}</span>
      </div>

      ${streakDays >= 7 ? `
      <p class="section-title">🔥 Consistency Award</p>
      <div class="streak">
        <span class="icon">🔥</span>
        <span class="text">${kidName} logged in <strong>${streakDays} days in a row</strong> this month! Incredible dedication.</span>
      </div>` : ''}

      <div class="cta">
        <a href="https://kidcaphq.com">View Full Dashboard →</a>
      </div>
    </div>

    <div class="footer">
      KidCapHQ · Teaching kids the language of business 🚀<br/>
      You're receiving this because you're linked as ${kidName}'s parent/guardian.
      <br/><a href="#" style="color:#9ca3af;">Unsubscribe</a>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// ─── Edge Function Handler ────────────────────────────────────────────────────
serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const body = await req.json();
        const { kidUserId, parentEmail, parentName, preview } = body;

        // Fetch kid profile
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', kidUserId)
            .single();

        if (error || !profile) {
            return new Response(JSON.stringify({ error: 'Kid profile not found' }), {
                status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

        const emailData = {
            parentName: parentName ?? 'Parent',
            kidName: profile.name ?? 'Your Kid',
            month,
            xpEarned: profile.xp ?? 0,
            level: profile.level ?? 1,
            bizCoins: profile.biz_coins ?? 0,
            lessonsCompleted: profile.lessons_completed ?? 0,
            gigsCompleted: profile.gigs_completed ?? 0,
            topAchievement: profile.top_achievement ?? 'Completed first business lesson!',
            streakDays: profile.streak_days ?? 0,
        };

        const html = buildEmail(emailData);

        // If preview=true, just return the HTML
        if (preview) {
            return new Response(JSON.stringify({ html, emailData }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Send via Resend
        const emailRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'KidCapHQ <reports@kidcaphq.com>',
                to: parentEmail,
                subject: `📊 ${emailData.kidName}'s Monthly Progress Report — ${month}`,
                html,
            }),
        });

        if (!emailRes.ok) {
            const err = await emailRes.text();
            throw new Error(`Resend error: ${err}`);
        }

        return new Response(JSON.stringify({ success: true, month }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('monthly-report error:', err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500, headers: { 'Content-Type': 'application/json' }
        });
    }
});
