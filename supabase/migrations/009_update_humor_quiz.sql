-- Update Humor Fundamentals quiz question answer and explanation
UPDATE public.lessons
SET content = (
  SELECT jsonb_agg(
    CASE
      WHEN elem->>'type' = 'quiz' AND elem->>'question' = 'Which type of humor is most attractive?'
      THEN elem
        || jsonb_build_object('options', '["Mean-spirited teasing","Exaggeration, Misdirection, Callback","Shock humor","Repeating memes"]'::jsonb)
        || jsonb_build_object('explanation', 'Exaggeration, Misdirection, Callback signals confidence — you''re secure enough to have fun while keeping her on her toes.')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(content) AS elem
)
WHERE slug = 'humor-fundamentals';
