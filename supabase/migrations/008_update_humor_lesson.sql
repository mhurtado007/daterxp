-- Update Humor Fundamentals lesson content
UPDATE public.lessons
SET content = (
  SELECT jsonb_agg(
    CASE
      WHEN elem->>'type' = 'theory' AND elem->>'heading' = 'Humor Is Not About Being Funny'
      THEN jsonb_set(elem, '{body}', '"Trying to be funny kills humor. The most attractive version of humor is being playful and having a good time."')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(content) AS elem
)
WHERE slug = 'humor-fundamentals';
