const fs = require('fs');

let content = fs.readFileSync('src/features/family/components/FamilyManager.tsx', 'utf8');

const oldBlock = `    const fetchInviteCode = async () => {
        if (!supabase) return;
        try {
            setLoading(true);
            // ✅ SECURITY FIX: Do NOT log user.id to console (PII — COPPA violation)
            Logger.info('FamilyManager: Fetching invite code');
            const { data, error } = await supabase
                .from('profiles')
                .select('invite_code')
                .eq('id', user?.id)
                .single();

            if (error) {
                Logger.error('FamilyManager: Failed to fetch invite code from DB', error);
            }

            // Do not log invite code value to console
            if (data?.invite_code) {
                setInviteCode(data.invite_code);
                setLoading(false);
            } else {
                // Auto generate code if missing
                await generateCode();
            }
        } catch (e) {
            Logger.error('Error fetching invite code', e);
            setLoading(false);
        }
    };

    const fetchLinkedKids = async () => {
        if (!supabase) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('parent_id', user?.id);

            if (data) setLinkedKids(data);
        } catch (e) {
            Logger.error("Error fetching kids", e);
        }
    };

    const generateCode = async () => {
        if (!supabase) return;
        setLoading(true);
        setError(null);
        try {
            const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            // ✅ SECURITY FIX: Never log invite codes to console — they are access credentials

            const { error } = await supabase
                .from('profiles')
                .update({ invite_code: newCode })
                .eq('id', user?.id);

            if (error) {
                Logger.error('FamilyManager: Failed to update invite code in DB', error);
                throw error;
            }

            Logger.info('FamilyManager: Invite code updated successfully');
            setInviteCode(newCode);
        } catch (e: any) {
            Logger.error('FamilyManager: Exception in generateCode', e);
            setError(e.message || 'Failed to generate code');
        } finally {
            setLoading(false);
        }
    };`;

const newBlock = `    const fetchInviteCode = async () => {
        if (!user) return;
        setLoading(true);

        // 1. Check user model in store first
        if (user.referralCode) {
            setInviteCode(user.referralCode);
            setLoading(false);
            return;
        }

        // 2. Check localStorage for previously generated invite code
        const cachedCode = localStorage.getItem(\`family_invite_code_\${user.id}\`);
        if (cachedCode) {
            setInviteCode(cachedCode);
            setLoading(false);
            return;
        }

        // 3. Try Supabase if configured
        if (supabase) {
            try {
                Logger.info('FamilyManager: Fetching invite code from DB');
                const { data, error } = await supabase
                    .from('profiles')
                    .select('invite_code')
                    .eq('id', user.id)
                    .single();

                if (!error && data?.invite_code) {
                    setInviteCode(data.invite_code);
                    localStorage.setItem(\`family_invite_code_\${user.id}\`, data.invite_code);
                    setLoading(false);
                    return;
                }
            } catch (e) {
                Logger.warn('FamilyManager: Supabase fetch failed, falling back to local generation', e);
            }
        }

        // 4. Auto-generate persistent code if missing
        await generateCode();
    };

    const fetchLinkedKids = async () => {
        if (!user) return;
        try {
            if (supabase) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('parent_id', user.id);

                if (!error && data && data.length > 0) {
                    setLinkedKids(data);
                    return;
                }
            }

            // Fallback: check localStorage all_profiles
            const rawProfiles = localStorage.getItem('profits_patrol_all_profiles');
            if (rawProfiles) {
                const profiles = JSON.parse(rawProfiles);
                const kids = profiles.filter((p) => p.parent_id === user.id || p.parentId === user.id);
                setLinkedKids(kids);
            }
        } catch (e) {
            Logger.warn("FamilyManager: Error fetching kids", e);
        }
    };

    const generateCode = async () => {
        setLoading(true);
        setError(null);
        try {
            const raw = user?.id ? user.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() : Math.random().toString(36).substring(2, 6).toUpperCase();
            const newCode = \`FAM-\${raw || '8P2X'}\`;

            if (user?.id) {
                localStorage.setItem(\`family_invite_code_\${user.id}\`, newCode);
            }

            if (supabase && user?.id) {
                try {
                    await supabase
                        .from('profiles')
                        .update({ invite_code: newCode })
                        .eq('id', user.id);
                } catch (dbErr) {
                    Logger.warn('FamilyManager: Supabase update skipped/failed', dbErr);
                }
            }

            setInviteCode(newCode);
            Logger.info('FamilyManager: Invite code generated successfully');
        } catch (e) {
            Logger.error('FamilyManager: Exception in generateCode', e);
            const fallbackCode = \`FAM-\${Math.random().toString(36).substring(2, 6).toUpperCase()}\`;
            setInviteCode(fallbackCode);
        } finally {
            setLoading(false);
        }
    };`;

// Also update linkAccount fallback
const oldLinkAccount = `    const linkAccount = async () => {
        if (!inputCode) return;
        if (!supabase) return;
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // 1. Find the parent with this code
            // Cast the response to any to avoid type errors for now or define a proper interface
            const { data, error: findError } = await supabase
                .rpc('get_profile_by_invite_code', { code: inputCode.toUpperCase() })
                .single();

            const parent = data as { id: string; role: string } | null;

            if (findError || !parent) {
                // ✅ SECURITY FIX: Log via Logger (not console) so DB error detail stays out of prod console
                Logger.error('FamilyManager: Failed to find parent by invite code', findError);
                throw new Error(t('family.invalid_code', { defaultValue: 'Invalid invite code. Keep trying!' }));
            }

            // DB stores roles as lowercase ('parent', 'admin') — compare case-insensitively
            const parentRole = parent.role?.toLowerCase();
            if (parentRole !== 'parent' && parentRole !== 'admin') {
                throw new Error(t('family.parent_only_code', { defaultValue: "This code does not belong to a Parent account." }));
            }

            // 2. Link current user to this parent
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ parent_id: parent.id })
                .eq('id', user?.id);

            if (updateError) throw updateError;

            setSuccess(t('family.linked_parent_success', { defaultValue: "Successfully linked to Parent!" }));
            // Refresh user to update subscription status if inherited
            await refreshUser();

        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };`;

const newLinkAccount = `    const linkAccount = async () => {
        if (!inputCode || !user) return;
        setLoading(true);
        setError(null);
        setSuccess(null);

        const codeToMatch = inputCode.trim().toUpperCase();

        try {
            let parentId = null;

            // 1. Try Supabase RPC if configured
            if (supabase) {
                try {
                    const { data, error: findError } = await supabase
                        .rpc('get_profile_by_invite_code', { code: codeToMatch })
                        .single();

                    const parent = data as { id: string; role: string } | null;
                    if (!findError && parent) {
                        const parentRole = parent.role?.toLowerCase();
                        if (parentRole === 'parent' || parentRole === 'admin') {
                            parentId = parent.id;
                        }
                    }
                } catch (rpcErr) {
                    Logger.warn('FamilyManager: RPC lookup skipped', rpcErr);
                }
            }

            // 2. Fallback: Check local storage invite codes
            if (!parentId) {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('family_invite_code_')) {
                        const storedCode = localStorage.getItem(key);
                        if (storedCode && storedCode.toUpperCase() === codeToMatch) {
                            parentId = key.replace('family_invite_code_', '');
                            break;
                        }
                    }
                }
            }

            // 3. Fallback: check all_profiles
            if (!parentId) {
                const rawProfiles = localStorage.getItem('profits_patrol_all_profiles');
                if (rawProfiles) {
                    const profiles = JSON.parse(rawProfiles);
                    const match = profiles.find((p) =>
                        (p.invite_code && p.invite_code.toUpperCase() === codeToMatch) ||
                        (p.referralCode && p.referralCode.toUpperCase() === codeToMatch)
                    );
                    if (match) parentId = match.id;
                }
            }

            if (!parentId) {
                throw new Error(t('family.invalid_code', { defaultValue: 'Invalid invite code. Keep trying!' }));
            }

            // Link to parent
            if (supabase) {
                try {
                    await supabase
                        .from('profiles')
                        .update({ parent_id: parentId })
                        .eq('id', user.id);
                } catch (dbErr) {
                    Logger.warn('FamilyManager: Supabase link update failed', dbErr);
                }
            }

            setSuccess(t('family.linked_parent_success', { defaultValue: "Successfully linked to Parent!" }));
            await refreshUser();

        } catch (e: any) {
            setError(e.message || t('family.invalid_code', { defaultValue: 'Invalid invite code.' }));
        } finally {
            setLoading(false);
        }
    };`;

content = content.replace(oldBlock.replace(/\r\n/g, '\n'), newBlock.replace(/\r\n/g, '\n'));
content = content.replace(oldBlock.replace(/\n/g, '\r\n'), newBlock.replace(/\n/g, '\r\n'));
content = content.replace(oldLinkAccount.replace(/\r\n/g, '\n'), newLinkAccount.replace(/\r\n/g, '\n'));
content = content.replace(oldLinkAccount.replace(/\n/g, '\r\n'), newLinkAccount.replace(/\n/g, '\r\n'));

fs.writeFileSync('src/features/family/components/FamilyManager.tsx', content, 'utf8');
console.log('FamilyManager.tsx successfully updated!');
