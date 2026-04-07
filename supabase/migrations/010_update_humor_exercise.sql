-- Update Humor Fundamentals exercise prompt
UPDATE public.lessons
SET content = (
  SELECT jsonb_agg(
    CASE
      WHEN elem->>'type' = 'exercise' AND elem->>'prompt' LIKE 'Think of one mildly embarrassing%'
      THEN jsonb_set(elem, '{prompt}', '"Think of one instance where you used Exaggeration, Misdirection, Callback while speaking with a woman or anyone in particular."')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(content) AS elem
)
WHERE slug = 'humor-fundamentals';
