
CREATE OR REPLACE FUNCTION public.get_top_users_by_scans()
RETURNS TABLE(email TEXT, scan_count BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.email, COUNT(s.id) as scan_count
  FROM public.scans s
  JOIN public.profiles p ON p.user_id = s.user_id
  GROUP BY p.email
  ORDER BY scan_count DESC
  LIMIT 10
$$;
