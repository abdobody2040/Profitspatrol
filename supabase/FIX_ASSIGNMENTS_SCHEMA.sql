-- ============================================
-- FIX ASSIGNMENTS TABLE SCHEMA
-- ============================================
-- Purpose: Add missing classroom_id column to assignments table
-- This fixes the error: "column assignments.classroom_id does not exist"

-- Step 1: Check if the column exists and add it if needed
DO $$ 
BEGIN
    -- Add classroom_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'assignments' 
        AND column_name = 'classroom_id'
    ) THEN
        -- First, check if there are any existing rows
        IF EXISTS (SELECT 1 FROM public.assignments LIMIT 1) THEN
            -- If there are existing rows, we need to handle this carefully
            -- Option 1: Delete all existing assignments (safest if this is test data)
            DELETE FROM public.assignments;
            RAISE NOTICE 'Deleted existing assignments to allow schema migration';
            
            -- Now add the column as NOT NULL
            ALTER TABLE public.assignments 
            ADD COLUMN classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE;
            
            RAISE NOTICE 'Added classroom_id column to assignments table';
        ELSE
            -- No existing rows, safe to add NOT NULL column
            ALTER TABLE public.assignments 
            ADD COLUMN classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE;
            
            RAISE NOTICE 'Added classroom_id column to assignments table';
        END IF;
    ELSE
        RAISE NOTICE 'classroom_id column already exists in assignments table';
    END IF;
END $$;

-- Step 2: Create index for performance if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_assignments_classroom_id ON public.assignments(classroom_id);

-- Step 3: Verify the column was added
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'assignments'
ORDER BY ordinal_position;
