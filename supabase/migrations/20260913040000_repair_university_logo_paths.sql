-- Repair legacy logo URLs whose page slugs differ from the filenames that
-- were uploaded to the versioned public Storage bucket. The objects are
-- already present; this migration only aligns catalogue metadata with them.

UPDATE public.universities AS university
SET
  logo_url = repaired.logo_url,
  updated_at = now()
FROM (
  VALUES
  ('adichunchanagiri-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/adichunchanagiri-university-karnataka.webp'),
  ('alliance-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/alliance-university-karnataka.webp'),
  ('amity-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/amity-university-uttar-pradesh-uttar-pradesh.webp'),
  ('andhra-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/andhra-university-andhra-pradesh.webp'),
  ('assam-down-town-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/assam-down-town-university-assam.webp'),
  ('bangalore-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bangalore-university-karnataka.webp'),
  ('bit-mesra-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/birla-institute-of-technology-jharkhand.webp'),
  ('central-university-himachal-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/central-university-of-himachal-pradesh-himachal-pradesh.webp'),
  ('chandigarh-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/chandigarh-university-punjab.webp'),
  ('charusat-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/charotar-university-of-science-and-technology-gujarat.webp'),
  ('christ-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/christ-deemed-to-be-university-karnataka.webp'),
  ('dayananda-sagar-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/dayananda-sagar-university-karnataka.webp'),
  ('devi-ahilya-vishwavidyalaya-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/devi-ahilya-vishwavidyalaya-madhya-pradesh.webp'),
  ('baou-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/dr-babasaheb-ambedkar-open-university-gujarat.webp'),
  ('dy-patil-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/dr-d-y-patil-vidyapeeth-pune-maharashtra.webp'),
  ('gls-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/gls-university-gujarat.webp'),
  ('gujarat-technological-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/gujarat-technological-university-gujarat.webp'),
  ('gujarat-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/gujarat-university-gujarat.webp'),
  ('guru-ghasidas-vishwavidyalaya-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/guru-ghasidas-vishwavidyalaya-chhattisgarh.svg'),
  ('ggsipu-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/guru-gobind-singh-indraprastha-university-delhi.webp'),
  ('gjust-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/guru-jambheshwar-university-of-science-and-technology-haryana.webp'),
  ('iift-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/indian-institute-of-foreign-trade-delhi.webp'),
  ('jain-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jain-deemed-to-be-university-karnataka.webp'),
  ('jamia-hamdard-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jamia-hamdard-delhi.svg'),
  ('jamia-millia-islamia-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jamia-millia-islamia-delhi.svg'),
  ('karnataka-state-open-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/karnataka-state-open-university-karnataka.webp'),
  ('kl-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/koneru-lakshmaiah-education-foundation-andhra-pradesh.svg'),
  ('kurukshetra-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/kurukshetra-university-haryana.webp'),
  ('lpu-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/lovely-professional-university-punjab.webp'),
  ('maharishi-markandeshwar-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/maharishi-markandeshwar-deemed-to-be-university-haryana.webp'),
  ('maharshi-dayanand-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/maharshi-dayanand-university-haryana.webp'),
  ('mahatma-gandhi-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mahatma-gandhi-university-kerala.webp'),
  ('manav-rachna-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/manav-rachna-international-institute-of-research-and-studies-haryana.webp'),
  ('manipal-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/manipal-university-jaipur-rajasthan.svg'),
  ('marwadi-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/marwadi-university-gujarat.svg'),
  ('mats-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mats-university-chhattisgarh.webp'),
  ('mohan-babu-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mohan-babu-university-andhra-pradesh.webp'),
  ('pp-savani-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/p-p-savani-university-gujarat.webp'),
  ('parul-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/parul-university-gujarat.svg'),
  ('sage-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sage-university-madhya-pradesh.webp'),
  ('shoolini-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/shoolini-university-of-biotechnology-and-management-sciences-himachal-pradesh.webp'),
  ('sgt-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/shree-guru-gobind-singh-tricentenary-university-haryana.svg'),
  ('sikkim-manipal-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sikkim-manipal-university-sikkim.webp'),
  ('university-of-jammu-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-jammu-jammu-and-kashmir.webp'),
  ('university-of-kerala-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-kerala-kerala.svg'),
  ('university-of-mysore-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-mysore-karnataka.webp'),
  ('uttaranchal-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/uttaranchal-university-uttarakhand.svg'),
  ('vignan-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/vignan-s-foundation-for-science-technology-and-research-andhra-pradesh.webp'),
  ('vtu-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/visvesvaraya-technological-university-karnataka.webp'),
  ('yenepoya-university-online', 'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/yenepoya-deemed-to-be-university-karnataka.webp')
) AS repaired(slug, logo_url)
WHERE university.slug = repaired.slug
  -- Do not overwrite a logo that an administrator has changed since the
  -- directory imports. Only replace the old 128 px Google favicon or the
  -- exact slug-derived Storage URL generated by the broken v1 import.
  AND (
    university.logo_url LIKE 'https://www.google.com/s2/favicons?domain=%'
    OR university.logo_url =
      'https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/'
      || repaired.slug
      || CASE
        WHEN repaired.logo_url LIKE '%.svg' THEN '.svg'
        WHEN repaired.logo_url LIKE '%.webp' THEN '.webp'
      END
  );
