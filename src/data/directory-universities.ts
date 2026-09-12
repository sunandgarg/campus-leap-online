import type { University } from "@/data/universities";

interface DirectoryUniversityInput {
  slug: string;
  name: string;
  shortName: string;
  state: string;
  universityType: string;
  evidenceCategory: string;
  referencePeriod: string;
  sourceUrl: string;
  checkedOn: string;
  nextReviewAt: string;
  logoUrl?: string;
}

function createDirectoryUniversity(input: DirectoryUniversityInput): University {
  return {
    slug: input.slug,
    name: input.name,
    shortName: input.shortName,
    city: "",
    state: input.state,
    established: 0,
    domain: "",
    accentColor: "#325DD2",
    naacGrade: "",
    approvals: [],
    rating: 0,
    reviews: 0,
    studentsEnrolled: "Not independently verified",
    placementPartners: [],
    highlights: [
      `University type: ${input.universityType}`,
      input.evidenceCategory,
      `Reference period: ${input.referencePeriod}`,
      "Programme and intake-specific verification required",
    ],
    about: `${input.name} is included in the DekhoCampus researched directory of Indian universities with evidence of online degree provision. This directory record covers ${input.referencePeriod}; it does not confirm that every programme or the latest intake is currently approved or open. Verify the exact programme, online mode, academic session and official application route before applying or paying.`,
    programs: [],
    profileDepth: "directory",
    verificationAcademicYear: input.referencePeriod,
    verificationSourceUrl: input.sourceUrl,
    lastVerified: input.checkedOn,
    verificationNextReviewAt: input.nextReviewAt,
    verificationCurrent: Date.parse(input.nextReviewAt) > Date.now(),
    metricsVerified: false,
    logoUrl: input.logoUrl,
  };
}

export const universityLogoUrls: Partial<Record<string, string>> = {
  "academy-of-maritime-education-and-training-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/academy-of-maritime-education-and-training-tamil-nadu.webp",
  "adichunchanagiri-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/adichunchanagiri-university-online.webp",
  "ajeenkya-d-y-patil-university-maharashtra":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/ajeenkya-d-y-patil-university-maharashtra.webp",
  "alagappa-university-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/alagappa-university-tamil-nadu.webp",
  "aligarh-muslim-university-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/aligarh-muslim-university-uttar-pradesh.webp",
  "alliance-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/alliance-university-online.webp",
  "amity-university-rajasthan-rajasthan":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/amity-university-rajasthan-rajasthan.webp",
  "amity-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/amity-university-online.webp",
  "amrita-vishwa-vidyapeetham-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/amrita-vishwa-vidyapeetham-tamil-nadu.svg",
  "andhra-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/andhra-university-online.webp",
  "anna-university-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/anna-university-tamil-nadu.webp",
  "arka-jain-university-jharkhand":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/arka-jain-university-jharkhand.webp",
  "assam-don-bosco-university-assam":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/assam-don-bosco-university-assam.webp",
  "assam-down-town-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/assam-down-town-university-online.webp",
  "b-s-abdur-rahman-crescent-institute-of-science-and-technology-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/b-s-abdur-rahman-crescent-institute-of-science-and-technology-tamil-nadu.webp",
  "banasthali-vidyapith-rajasthan":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/banasthali-vidyapith-rajasthan.webp",
  "bangalore-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bangalore-university-online.webp",
  "bennett-university-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bennett-university-uttar-pradesh.webp",
  "bharath-institute-of-higher-education-and-research-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bharath-institute-of-higher-education-and-research-tamil-nadu.svg",
  "bharathiar-university-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bharathiar-university-tamil-nadu.webp",
  "bharathidasan-university-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bharathidasan-university-tamil-nadu.webp",
  "bharati-vidyapeeth-deemed-to-be-university-maharashtra":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bharati-vidyapeeth-deemed-to-be-university-maharashtra.svg",
  "bit-mesra-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bit-mesra-online.webp",
  "birla-institute-of-technology-and-science-pilani-rajasthan":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/birla-institute-of-technology-and-science-pilani-rajasthan.svg",
  "bml-munjal-university-haryana":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bml-munjal-university-haryana.webp",
  "central-sanskrit-university-delhi":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/central-sanskrit-university-delhi.webp",
  "central-university-himachal-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/central-university-himachal-online.webp",
  "central-university-of-tamil-nadu-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/central-university-of-tamil-nadu-tamil-nadu.webp",
  "centurion-university-of-technology-and-management-odisha":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/centurion-university-of-technology-and-management-odisha.webp",
  "chandigarh-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/chandigarh-university-online.webp",
  "charusat-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/charusat-online.webp",
  "chaudhary-charan-singh-university-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/chaudhary-charan-singh-university-uttar-pradesh.webp",
  "chhatrapati-shahu-ji-maharaj-university-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/chhatrapati-shahu-ji-maharaj-university-uttar-pradesh.webp",
  "chitkara-university-punjab":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/chitkara-university-punjab.webp",
  "christ-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/christ-university-online.webp",
  "d-y-patil-deemed-to-be-university-navi-mumbai-maharashtra":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/d-y-patil-deemed-to-be-university-navi-mumbai-maharashtra.webp",
  "datta-meghe-institute-of-higher-education-and-research-maharashtra":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/datta-meghe-institute-of-higher-education-and-research-maharashtra.webp",
  "dayalbagh-educational-institute-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/dayalbagh-educational-institute-uttar-pradesh.webp",
  "dayananda-sagar-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/dayananda-sagar-university-online.webp",
  "deen-dayal-upadhyaya-gorakhpur-university-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/deen-dayal-upadhyaya-gorakhpur-university-uttar-pradesh.webp",
  "desh-bhagat-university-punjab":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/desh-bhagat-university-punjab.webp",
  "devi-ahilya-vishwavidyalaya-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/devi-ahilya-vishwavidyalaya-online.webp",
  "dr-b-r-ambedkar-open-university-telangana":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/dr-b-r-ambedkar-open-university-telangana.webp",
  "baou-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/baou-online.webp",
  "dy-patil-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/dy-patil-university-online.webp",
  "dr-m-g-r-educational-and-research-institute-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/dr-m-g-r-educational-and-research-institute-tamil-nadu.webp",
  "galgotias-university-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/galgotias-university-uttar-pradesh.webp",
  "ganpat-university-gujarat":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/ganpat-university-gujarat.webp",
  "gla-university-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/gla-university-uttar-pradesh.webp",
  "gls-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/gls-university-online.webp",
  "graphic-era-deemed-to-be-university-uttarakhand":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/graphic-era-deemed-to-be-university-uttarakhand.webp",
  "gujarat-technological-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/gujarat-technological-university-online.webp",
  "gujarat-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/gujarat-university-online.webp",
  "guru-ghasidas-vishwavidyalaya-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/guru-ghasidas-vishwavidyalaya-online.svg",
  "ggsipu-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/ggsipu-online.webp",
  "gjust-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/gjust-online.webp",
  "guru-kashi-university-punjab":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/guru-kashi-university-punjab.webp",
  "guru-nanak-dev-university-punjab":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/guru-nanak-dev-university-punjab.webp",
  "hindustan-institute-of-technology-and-science-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/hindustan-institute-of-technology-and-science-tamil-nadu.webp",
  "icfai-foundation-for-higher-education-telangana":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/icfai-foundation-for-higher-education-telangana.svg",
  "iift-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/iift-online.webp",
  "indira-gandhi-national-open-university-delhi":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/indira-gandhi-national-open-university-delhi.svg",
  "integral-university-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/integral-university-uttar-pradesh.webp",
  "international-institute-of-information-technology-hyderabad-telangana":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/international-institute-of-information-technology-hyderabad-telangana.webp",
  "jagannath-university-rajasthan":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jagannath-university-rajasthan.svg",
  "jain-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jain-university-online.webp",
  "jaipur-national-university-rajasthan":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jaipur-national-university-rajasthan.webp",
  "jamia-hamdard-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jamia-hamdard-online.svg",
  "jamia-millia-islamia-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jamia-millia-islamia-online.svg",
  "jawaharlal-nehru-university-delhi":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jawaharlal-nehru-university-delhi.svg",
  "jaypee-institute-of-information-technology-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jaypee-institute-of-information-technology-uttar-pradesh.svg",
  "jss-academy-of-higher-education-and-research-karnataka":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jss-academy-of-higher-education-and-research-karnataka.webp",
  "kalasalingam-academy-of-research-and-education-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/kalasalingam-academy-of-research-and-education-tamil-nadu.webp",
  "kalinga-institute-of-industrial-technology-odisha":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/kalinga-institute-of-industrial-technology-odisha.svg",
  "karnataka-state-open-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/karnataka-state-open-university-online.webp",
  "karunya-institute-of-technology-and-sciences-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/karunya-institute-of-technology-and-sciences-tamil-nadu.svg",
  "kl-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/kl-university-online.svg",
  "kurukshetra-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/kurukshetra-university-online.webp",
  "lpu-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/lpu-online.webp",
  "madurai-kamaraj-university-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/madurai-kamaraj-university-tamil-nadu.webp",
  "maharishi-markandeshwar-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/maharishi-markandeshwar-online.webp",
  "maharshi-dayanand-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/maharshi-dayanand-university-online.webp",
  "mahatma-gandhi-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mahatma-gandhi-university-online.webp",
  "mahatma-jyotiba-phule-rohilkhand-university-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mahatma-jyotiba-phule-rohilkhand-university-uttar-pradesh.webp",
  "manav-rachna-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/manav-rachna-online.webp",
  "mangalayatan-university-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mangalayatan-university-uttar-pradesh.webp",
  "manipal-academy-of-higher-education-karnataka":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/manipal-academy-of-higher-education-karnataka.svg",
  "manipal-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/manipal-university-online.svg",
  "manonmaniam-sundaranar-university-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/manonmaniam-sundaranar-university-tamil-nadu.webp",
  "marwadi-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/marwadi-university-online.svg",
  "mats-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mats-university-online.webp",
  "meenakshi-academy-of-higher-education-and-research-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/meenakshi-academy-of-higher-education-and-research-tamil-nadu.webp",
  "mizoram-university-mizoram":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mizoram-university-mizoram.webp",
  "mody-university-of-science-and-technology-rajasthan":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mody-university-of-science-and-technology-rajasthan.webp",
  "mohan-babu-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mohan-babu-university-online.webp",
  "noida-international-university-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/noida-international-university-uttar-pradesh.svg",
  "o-p-jindal-global-university-haryana":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/o-p-jindal-global-university-haryana.webp",
  "pp-savani-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/pp-savani-university-online.webp",
  "parul-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/parul-university-online.svg",
  "pt-sundarlal-sharma-open-university-chhattisgarh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/pt-sundarlal-sharma-open-university-chhattisgarh.webp",
  "sage-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sage-university-online.webp",
  "sandip-university-maharashtra":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sandip-university-maharashtra.webp",
  "sathyabama-institute-of-science-and-technology-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sathyabama-institute-of-science-and-technology-tamil-nadu.webp",
  "savitribai-phule-pune-university-maharashtra":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/savitribai-phule-pune-university-maharashtra.webp",
  "shanmugha-arts-science-technology-and-research-academy-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/shanmugha-arts-science-technology-and-research-academy-tamil-nadu.webp",
  "sharda-university-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sharda-university-uttar-pradesh.webp",
  "shiv-nadar-institution-of-eminence-deemed-to-be-university-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/shiv-nadar-institution-of-eminence-deemed-to-be-university-uttar-pradesh.webp",
  "shivaji-university-maharashtra":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/shivaji-university-maharashtra.webp",
  "shobhit-institute-of-engineering-and-technology-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/shobhit-institute-of-engineering-and-technology-uttar-pradesh.webp",
  "shoolini-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/shoolini-university-online.webp",
  "sgt-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sgt-university-online.svg",
  "shri-ramasamy-memorial-university-sikkim-sikkim":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/shri-ramasamy-memorial-university-sikkim-sikkim.webp",
  "sikkim-manipal-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sikkim-manipal-university-online.webp",
  "silver-oak-university-gujarat":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/silver-oak-university-gujarat.webp",
  "sri-ramachandra-institute-of-higher-education-and-research-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sri-ramachandra-institute-of-higher-education-and-research-tamil-nadu.webp",
  "sri-siddhartha-academy-of-higher-education-karnataka":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sri-siddhartha-academy-of-higher-education-karnataka.webp",
  "sri-venkateswara-university-andhra-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sri-venkateswara-university-andhra-pradesh.webp",
  "srinivas-university-karnataka":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/srinivas-university-karnataka.webp",
  "srm-institute-of-science-and-technology-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/srm-institute-of-science-and-technology-tamil-nadu.svg",
  "svkm-s-narsee-monjee-institute-of-management-studies-maharashtra":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/svkm-s-narsee-monjee-institute-of-management-studies-maharashtra.webp",
  "swami-rama-himalayan-university-uttarakhand":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/swami-rama-himalayan-university-uttarakhand.webp",
  "swami-vivekanand-subharti-university-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/swami-vivekanand-subharti-university-uttar-pradesh.webp",
  "symbiosis-international-deemed-university-maharashtra":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/symbiosis-international-deemed-university-maharashtra.webp",
  "teerthanker-mahaveer-university-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/teerthanker-mahaveer-university-uttar-pradesh.webp",
  "the-northcap-university-haryana":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/the-northcap-university-haryana.webp",
  "university-of-calicut-kerala":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-calicut-kerala.webp",
  "university-of-jammu-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-jammu-online.webp",
  "university-of-kerala-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-kerala-online.svg",
  "university-of-lucknow-uttar-pradesh":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-lucknow-uttar-pradesh.webp",
  "university-of-madras-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-madras-tamil-nadu.svg",
  "university-of-mumbai-maharashtra":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-mumbai-maharashtra.svg",
  "university-of-mysore-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-mysore-online.webp",
  "university-of-petroleum-and-energy-studies-uttarakhand":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-petroleum-and-energy-studies-uttarakhand.webp",
  "uttaranchal-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/uttaranchal-university-online.svg",
  "vellore-institute-of-technology-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/vellore-institute-of-technology-tamil-nadu.webp",
  "vels-institute-of-science-technology-and-advanced-studies-tamil-nadu":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/vels-institute-of-science-technology-and-advanced-studies-tamil-nadu.webp",
  "vignan-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/vignan-university-online.webp",
  "vtu-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/vtu-online.webp",
  "vivekananda-global-university-rajasthan":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/vivekananda-global-university-rajasthan.webp",
  "yenepoya-university-online":
    "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/yenepoya-university-online.webp",
};

const directoryInputs: DirectoryUniversityInput[] = [
  {
    slug: "academy-of-maritime-education-and-training-tamil-nadu",
    name: "Academy of Maritime Education and Training",
    shortName: "AMET University",
    state: "Tamil Nadu",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC recognition list - third-party mirror",
    referencePeriod: "B.Com from February 2024; BBA/MBA for August 2026 and January-February 2027",
    sourceUrl:
      "https://www.scribd.com/document/1075897337/140-Upload-RecognitionDetails-20260810153344",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/academy-of-maritime-education-and-training-tamil-nadu.webp",
  },
  {
    slug: "adichunchanagiri-university-online",
    name: "Adichunchanagiri University",
    shortName: "ACU",
    state: "Karnataka",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/adichunchanagiri-university-online.webp",
  },
  {
    slug: "ajeenkya-d-y-patil-university-maharashtra",
    name: "Ajeenkya D. Y. Patil University",
    shortName: "ADYPU",
    state: "Maharashtra",
    universityType: "Private University",
    evidenceCategory: "UGC recognition list - third-party mirror",
    referencePeriod: "August 2026 onward",
    sourceUrl:
      "https://www.scribd.com/document/1075897337/140-Upload-RecognitionDetails-20260810153344",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/ajeenkya-d-y-patil-university-maharashtra.webp",
  },
  {
    slug: "alagappa-university-tamil-nadu",
    name: "Alagappa University",
    shortName: "Alagappa University",
    state: "Tamil Nadu",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/alagappa-university-tamil-nadu.webp",
  },
  {
    slug: "aligarh-muslim-university-uttar-pradesh",
    name: "Aligarh Muslim University",
    shortName: "AMU",
    state: "Uttar Pradesh",
    universityType: "Central University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/aligarh-muslim-university-uttar-pradesh.webp",
  },
  {
    slug: "alliance-university-online",
    name: "Alliance University",
    shortName: "Alliance University",
    state: "Karnataka",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/alliance-university-online.webp",
  },
  {
    slug: "amity-university-rajasthan-rajasthan",
    name: "Amity University Rajasthan",
    shortName: "Amity University Jaipur",
    state: "Rajasthan",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/amity-university-rajasthan-rajasthan.webp",
  },
  {
    slug: "amrita-vishwa-vidyapeetham-tamil-nadu",
    name: "Amrita Vishwa Vidyapeetham",
    shortName: "Amrita University",
    state: "Tamil Nadu",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/amrita-vishwa-vidyapeetham-tamil-nadu.svg",
  },
  {
    slug: "andhra-university-online",
    name: "Andhra University",
    shortName: "Andhra University",
    state: "Andhra Pradesh",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/andhra-university-online.webp",
  },
  {
    slug: "anna-university-tamil-nadu",
    name: "Anna University",
    shortName: "Anna University",
    state: "Tamil Nadu",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/anna-university-tamil-nadu.webp",
  },
  {
    slug: "arka-jain-university-jharkhand",
    name: "Arka Jain University",
    shortName: "AJU",
    state: "Jharkhand",
    universityType: "Private University",
    evidenceCategory: "UGC recognition list - third-party mirror",
    referencePeriod: "February 2025 onward; additional programmes from July-August 2025",
    sourceUrl:
      "https://www.scribd.com/document/1075897337/140-Upload-RecognitionDetails-20260810153344",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/arka-jain-university-jharkhand.webp",
  },
  {
    slug: "assam-don-bosco-university-assam",
    name: "Assam Don Bosco University",
    shortName: "ADBU",
    state: "Assam",
    universityType: "Private University",
    evidenceCategory: "UGC recognition list - third-party mirror",
    referencePeriod: "July-August 2025 onward; additional programmes from February 2026",
    sourceUrl:
      "https://www.scribd.com/document/1075897337/140-Upload-RecognitionDetails-20260810153344",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/assam-don-bosco-university-assam.webp",
  },
  {
    slug: "assam-down-town-university-online",
    name: "Assam Down Town University",
    shortName: "AdtU",
    state: "Assam",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/assam-down-town-university-online.webp",
  },
  {
    slug: "b-s-abdur-rahman-crescent-institute-of-science-and-technology-tamil-nadu",
    name: "B. S. Abdur Rahman Crescent Institute of Science and Technology",
    shortName: "Crescent",
    state: "Tamil Nadu",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/b-s-abdur-rahman-crescent-institute-of-science-and-technology-tamil-nadu.webp",
  },
  {
    slug: "banasthali-vidyapith-rajasthan",
    name: "Banasthali Vidyapith",
    shortName: "Banasthali Vidyapith",
    state: "Rajasthan",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/banasthali-vidyapith-rajasthan.webp",
  },
  {
    slug: "bangalore-university-online",
    name: "Bangalore University",
    shortName: "Bangalore University",
    state: "Karnataka",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bangalore-university-online.webp",
  },
  {
    slug: "bennett-university-uttar-pradesh",
    name: "Bennett University",
    shortName: "Bennett University",
    state: "Uttar Pradesh",
    universityType: "Private University",
    evidenceCategory: "UGC entitlement notice - university-hosted copy",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://shardaonline.ai/assets/sharda/ugc-deb-approval.pdf",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bennett-university-uttar-pradesh.webp",
  },
  {
    slug: "bharath-institute-of-higher-education-and-research-tamil-nadu",
    name: "Bharath Institute of Higher Education and Research",
    shortName: "BIHER",
    state: "Tamil Nadu",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bharath-institute-of-higher-education-and-research-tamil-nadu.svg",
  },
  {
    slug: "bharathiar-university-tamil-nadu",
    name: "Bharathiar University",
    shortName: "Bharathiar University",
    state: "Tamil Nadu",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bharathiar-university-tamil-nadu.webp",
  },
  {
    slug: "bharathidasan-university-tamil-nadu",
    name: "Bharathidasan University",
    shortName: "Bharathidasan University",
    state: "Tamil Nadu",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bharathidasan-university-tamil-nadu.webp",
  },
  {
    slug: "bharati-vidyapeeth-deemed-to-be-university-maharashtra",
    name: "Bharati Vidyapeeth (Deemed to be University)",
    shortName: "BVDU",
    state: "Maharashtra",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bharati-vidyapeeth-deemed-to-be-university-maharashtra.svg",
  },
  {
    slug: "bit-mesra-online",
    name: "Birla Institute of Technology",
    shortName: "BIT Mesra",
    state: "Jharkhand",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bit-mesra-online.webp",
  },
  {
    slug: "birla-institute-of-technology-and-science-pilani-rajasthan",
    name: "Birla Institute of Technology and Science, Pilani",
    shortName: "BITS Pilani",
    state: "Rajasthan",
    universityType: "Deemed-to-be University",
    evidenceCategory: "Official university programme page",
    referencePeriod: "Live university online-programme page accessed September 2026",
    sourceUrl:
      "https://www.bits-pilani.ac.in/admissions/online-programme/bachelor-of-science-in-computer-science/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/birla-institute-of-technology-and-science-pilani-rajasthan.svg",
  },
  {
    slug: "bml-munjal-university-haryana",
    name: "BML Munjal University",
    shortName: "BMU",
    state: "Haryana",
    universityType: "Private University",
    evidenceCategory: "UGC recognition list - third-party mirror",
    referencePeriod: "February 2026 onward",
    sourceUrl:
      "https://www.scribd.com/document/1075897337/140-Upload-RecognitionDetails-20260810153344",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/bml-munjal-university-haryana.webp",
  },
  {
    slug: "central-sanskrit-university-delhi",
    name: "Central Sanskrit University",
    shortName: "Central Sanskrit University",
    state: "Delhi",
    universityType: "Central University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/central-sanskrit-university-delhi.webp",
  },
  {
    slug: "central-university-himachal-online",
    name: "Central University of Himachal Pradesh",
    shortName: "CUHP",
    state: "Himachal Pradesh",
    universityType: "Central University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/central-university-himachal-online.webp",
  },
  {
    slug: "central-university-of-tamil-nadu-tamil-nadu",
    name: "Central University of Tamil Nadu",
    shortName: "CUTN",
    state: "Tamil Nadu",
    universityType: "Central University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/central-university-of-tamil-nadu-tamil-nadu.webp",
  },
  {
    slug: "centurion-university-of-technology-and-management-odisha",
    name: "Centurion University of Technology and Management",
    shortName: "CUTM Odisha",
    state: "Odisha",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/centurion-university-of-technology-and-management-odisha.webp",
  },
  {
    slug: "charusat-online",
    name: "Charotar University of Science and Technology",
    shortName: "CHARUSAT",
    state: "Gujarat",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/charusat-online.webp",
  },
  {
    slug: "chaudhary-charan-singh-university-uttar-pradesh",
    name: "Chaudhary Charan Singh University",
    shortName: "CCS University Meerut",
    state: "Uttar Pradesh",
    universityType: "State University",
    evidenceCategory: "UGC entitlement notice - university-hosted copy",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://shardaonline.ai/assets/sharda/ugc-deb-approval.pdf",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/chaudhary-charan-singh-university-uttar-pradesh.webp",
  },
  {
    slug: "chhatrapati-shahu-ji-maharaj-university-uttar-pradesh",
    name: "Chhatrapati Shahu Ji Maharaj University",
    shortName: "CSJMU Kanpur",
    state: "Uttar Pradesh",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/chhatrapati-shahu-ji-maharaj-university-uttar-pradesh.webp",
  },
  {
    slug: "chitkara-university-punjab",
    name: "Chitkara University",
    shortName: "Chitkara University Punjab",
    state: "Punjab",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/chitkara-university-punjab.webp",
  },
  {
    slug: "christ-university-online",
    name: "Christ (Deemed to be University)",
    shortName: "CHRIST University",
    state: "Karnataka",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/christ-university-online.webp",
  },
  {
    slug: "d-y-patil-deemed-to-be-university-navi-mumbai-maharashtra",
    name: "D. Y. Patil (Deemed to be University), Navi Mumbai",
    shortName: "DYPU Navi Mumbai",
    state: "Maharashtra",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/d-y-patil-deemed-to-be-university-navi-mumbai-maharashtra.webp",
  },
  {
    slug: "datta-meghe-institute-of-higher-education-and-research-maharashtra",
    name: "Datta Meghe Institute of Higher Education and Research",
    shortName: "DMIHER",
    state: "Maharashtra",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/datta-meghe-institute-of-higher-education-and-research-maharashtra.webp",
  },
  {
    slug: "dayalbagh-educational-institute-uttar-pradesh",
    name: "Dayalbagh Educational Institute",
    shortName: "DEI",
    state: "Uttar Pradesh",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/dayalbagh-educational-institute-uttar-pradesh.webp",
  },
  {
    slug: "dayananda-sagar-university-online",
    name: "Dayananda Sagar University",
    shortName: "DSU",
    state: "Karnataka",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/dayananda-sagar-university-online.webp",
  },
  {
    slug: "deen-dayal-upadhyaya-gorakhpur-university-uttar-pradesh",
    name: "Deen Dayal Upadhyaya Gorakhpur University",
    shortName: "DDU Gorakhpur University",
    state: "Uttar Pradesh",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/deen-dayal-upadhyaya-gorakhpur-university-uttar-pradesh.webp",
  },
  {
    slug: "desh-bhagat-university-punjab",
    name: "Desh Bhagat University",
    shortName: "DBU",
    state: "Punjab",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/desh-bhagat-university-punjab.webp",
  },
  {
    slug: "devi-ahilya-vishwavidyalaya-online",
    name: "Devi Ahilya Vishwavidyalaya",
    shortName: "DAVV",
    state: "Madhya Pradesh",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/devi-ahilya-vishwavidyalaya-online.webp",
  },
  {
    slug: "dr-b-r-ambedkar-open-university-telangana",
    name: "Dr. B. R. Ambedkar Open University",
    shortName: "BRAOU",
    state: "Telangana",
    universityType: "State Open University",
    evidenceCategory: "UGC recognition list - third-party mirror",
    referencePeriod: "August 2026 onward",
    sourceUrl:
      "https://www.scribd.com/document/1075897337/140-Upload-RecognitionDetails-20260810153344",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/dr-b-r-ambedkar-open-university-telangana.webp",
  },
  {
    slug: "baou-online",
    name: "Dr. Babasaheb Ambedkar Open University",
    shortName: "BAOU",
    state: "Gujarat",
    universityType: "State Open University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/baou-online.webp",
  },
  {
    slug: "dr-m-g-r-educational-and-research-institute-tamil-nadu",
    name: "Dr. M.G.R. Educational and Research Institute",
    shortName: "Dr. M.G.R. Educational and Research Institute",
    state: "Tamil Nadu",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/dr-m-g-r-educational-and-research-institute-tamil-nadu.webp",
  },
  {
    slug: "galgotias-university-uttar-pradesh",
    name: "Galgotias University",
    shortName: "Galgotias University",
    state: "Uttar Pradesh",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/galgotias-university-uttar-pradesh.webp",
  },
  {
    slug: "ganpat-university-gujarat",
    name: "Ganpat University",
    shortName: "GNU",
    state: "Gujarat",
    universityType: "Private University",
    evidenceCategory: "UGC recognition list - third-party mirror",
    referencePeriod: "July-August 2025 onward",
    sourceUrl:
      "https://www.scribd.com/document/1075897337/140-Upload-RecognitionDetails-20260810153344",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/ganpat-university-gujarat.webp",
  },
  {
    slug: "gla-university-uttar-pradesh",
    name: "GLA University",
    shortName: "G.L.A. University",
    state: "Uttar Pradesh",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/gla-university-uttar-pradesh.webp",
  },
  {
    slug: "gls-university-online",
    name: "GLS University",
    shortName: "G.L.S. University",
    state: "Gujarat",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/gls-university-online.webp",
  },
  {
    slug: "graphic-era-deemed-to-be-university-uttarakhand",
    name: "Graphic Era (Deemed to be University)",
    shortName: "Graphic Era",
    state: "Uttarakhand",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/graphic-era-deemed-to-be-university-uttarakhand.webp",
  },
  {
    slug: "gujarat-technological-university-online",
    name: "Gujarat Technological University",
    shortName: "GTU",
    state: "Gujarat",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/gujarat-technological-university-online.webp",
  },
  {
    slug: "gujarat-university-online",
    name: "Gujarat University",
    shortName: "Gujarat University",
    state: "Gujarat",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/gujarat-university-online.webp",
  },
  {
    slug: "guru-ghasidas-vishwavidyalaya-online",
    name: "Guru Ghasidas Vishwavidyalaya",
    shortName: "GGV",
    state: "Chhattisgarh",
    universityType: "Central University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/guru-ghasidas-vishwavidyalaya-online.svg",
  },
  {
    slug: "ggsipu-online",
    name: "Guru Gobind Singh Indraprastha University",
    shortName: "GGSIPU",
    state: "Delhi",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/ggsipu-online.webp",
  },
  {
    slug: "gjust-online",
    name: "Guru Jambheshwar University of Science and Technology",
    shortName: "GJUST",
    state: "Haryana",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/gjust-online.webp",
  },
  {
    slug: "guru-kashi-university-punjab",
    name: "Guru Kashi University",
    shortName: "GKU",
    state: "Punjab",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/guru-kashi-university-punjab.webp",
  },
  {
    slug: "guru-nanak-dev-university-punjab",
    name: "Guru Nanak Dev University",
    shortName: "GNDU",
    state: "Punjab",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/guru-nanak-dev-university-punjab.webp",
  },
  {
    slug: "hindustan-institute-of-technology-and-science-tamil-nadu",
    name: "Hindustan Institute of Technology and Science",
    shortName: "HITS",
    state: "Tamil Nadu",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/hindustan-institute-of-technology-and-science-tamil-nadu.webp",
  },
  {
    slug: "icfai-foundation-for-higher-education-telangana",
    name: "ICFAI Foundation for Higher Education",
    shortName: "IFHE Hyderabad",
    state: "Telangana",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/icfai-foundation-for-higher-education-telangana.svg",
  },
  {
    slug: "iift-online",
    name: "Indian Institute of Foreign Trade",
    shortName: "IIFT",
    state: "Delhi",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/iift-online.webp",
  },
  {
    slug: "indira-gandhi-national-open-university-delhi",
    name: "Indira Gandhi National Open University",
    shortName: "IGNOU",
    state: "Delhi",
    universityType: "Central Open University",
    evidenceCategory: "Official university online-admissions portal",
    referencePeriod: "July 2026 online intake",
    sourceUrl: "https://ignouiop.samarth.edu.in/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/indira-gandhi-national-open-university-delhi.svg",
  },
  {
    slug: "integral-university-uttar-pradesh",
    name: "Integral University",
    shortName: "Integral University",
    state: "Uttar Pradesh",
    universityType: "Private University",
    evidenceCategory: "UGC entitlement notice - university-hosted copy",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://shardaonline.ai/assets/sharda/ugc-deb-approval.pdf",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/integral-university-uttar-pradesh.webp",
  },
  {
    slug: "international-institute-of-information-technology-hyderabad-telangana",
    name: "International Institute of Information Technology Hyderabad",
    shortName: "IIIT Hyderabad",
    state: "Telangana",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/international-institute-of-information-technology-hyderabad-telangana.webp",
  },
  {
    slug: "jagannath-university-rajasthan",
    name: "Jagannath University",
    shortName: "Jagannath University Jaipur",
    state: "Rajasthan",
    universityType: "Private University",
    evidenceCategory: "UGC recognition list - third-party mirror",
    referencePeriod: "January-February 2024 onward; additional programmes from October 2024",
    sourceUrl:
      "https://www.scribd.com/document/1075897337/140-Upload-RecognitionDetails-20260810153344",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jagannath-university-rajasthan.svg",
  },
  {
    slug: "jaipur-national-university-rajasthan",
    name: "Jaipur National University",
    shortName: "JNU Jaipur",
    state: "Rajasthan",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jaipur-national-university-rajasthan.webp",
  },
  {
    slug: "jamia-hamdard-online",
    name: "Jamia Hamdard",
    shortName: "Jamia Hamdard",
    state: "Delhi",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jamia-hamdard-online.svg",
  },
  {
    slug: "jamia-millia-islamia-online",
    name: "Jamia Millia Islamia",
    shortName: "JMI",
    state: "Delhi",
    universityType: "Central University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jamia-millia-islamia-online.svg",
  },
  {
    slug: "jawaharlal-nehru-university-delhi",
    name: "Jawaharlal Nehru University",
    shortName: "JNU Delhi",
    state: "Delhi",
    universityType: "Central University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jawaharlal-nehru-university-delhi.svg",
  },
  {
    slug: "jaypee-institute-of-information-technology-uttar-pradesh",
    name: "Jaypee Institute of Information Technology",
    shortName: "JIIT Noida",
    state: "Uttar Pradesh",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC recognition list - third-party mirror",
    referencePeriod: "August 2026 to February 2027",
    sourceUrl:
      "https://www.scribd.com/document/1075897337/140-Upload-RecognitionDetails-20260810153344",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jaypee-institute-of-information-technology-uttar-pradesh.svg",
  },
  {
    slug: "jss-academy-of-higher-education-and-research-karnataka",
    name: "JSS Academy of Higher Education and Research",
    shortName: "JSS AHER",
    state: "Karnataka",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/jss-academy-of-higher-education-and-research-karnataka.webp",
  },
  {
    slug: "kalasalingam-academy-of-research-and-education-tamil-nadu",
    name: "Kalasalingam Academy of Research and Education",
    shortName: "KARE",
    state: "Tamil Nadu",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/kalasalingam-academy-of-research-and-education-tamil-nadu.webp",
  },
  {
    slug: "kalinga-institute-of-industrial-technology-odisha",
    name: "Kalinga Institute of Industrial Technology",
    shortName: "KIIT",
    state: "Odisha",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/kalinga-institute-of-industrial-technology-odisha.svg",
  },
  {
    slug: "karnataka-state-open-university-online",
    name: "Karnataka State Open University",
    shortName: "KSOU",
    state: "Karnataka",
    universityType: "State Open University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/karnataka-state-open-university-online.webp",
  },
  {
    slug: "karunya-institute-of-technology-and-sciences-tamil-nadu",
    name: "Karunya Institute of Technology and Sciences",
    shortName: "Karunya",
    state: "Tamil Nadu",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/karunya-institute-of-technology-and-sciences-tamil-nadu.svg",
  },
  {
    slug: "kl-university-online",
    name: "Koneru Lakshmaiah Education Foundation",
    shortName: "KL University",
    state: "Andhra Pradesh",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/kl-university-online.svg",
  },
  {
    slug: "kurukshetra-university-online",
    name: "Kurukshetra University",
    shortName: "KUK",
    state: "Haryana",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/kurukshetra-university-online.webp",
  },
  {
    slug: "madurai-kamaraj-university-tamil-nadu",
    name: "Madurai Kamaraj University",
    shortName: "MKU",
    state: "Tamil Nadu",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/madurai-kamaraj-university-tamil-nadu.webp",
  },
  {
    slug: "maharishi-markandeshwar-online",
    name: "Maharishi Markandeshwar (Deemed to be University)",
    shortName: "MM(DU)",
    state: "Haryana",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/maharishi-markandeshwar-online.webp",
  },
  {
    slug: "maharshi-dayanand-university-online",
    name: "Maharshi Dayanand University",
    shortName: "MDU Rohtak",
    state: "Haryana",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/maharshi-dayanand-university-online.webp",
  },
  {
    slug: "mahatma-gandhi-university-online",
    name: "Mahatma Gandhi University",
    shortName: "MGU Kerala",
    state: "Kerala",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mahatma-gandhi-university-online.webp",
  },
  {
    slug: "mahatma-jyotiba-phule-rohilkhand-university-uttar-pradesh",
    name: "Mahatma Jyotiba Phule Rohilkhand University",
    shortName: "MJPRU",
    state: "Uttar Pradesh",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mahatma-jyotiba-phule-rohilkhand-university-uttar-pradesh.webp",
  },
  {
    slug: "manav-rachna-online",
    name: "Manav Rachna International Institute of Research and Studies",
    shortName: "MRIIRS",
    state: "Haryana",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/manav-rachna-online.webp",
  },
  {
    slug: "mangalayatan-university-uttar-pradesh",
    name: "Mangalayatan University",
    shortName: "Mangalayatan University Aligarh",
    state: "Uttar Pradesh",
    universityType: "Private University",
    evidenceCategory: "UGC entitlement notice - university-hosted copy",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://shardaonline.ai/assets/sharda/ugc-deb-approval.pdf",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mangalayatan-university-uttar-pradesh.webp",
  },
  {
    slug: "manipal-academy-of-higher-education-karnataka",
    name: "Manipal Academy of Higher Education",
    shortName: "MAHE",
    state: "Karnataka",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/manipal-academy-of-higher-education-karnataka.svg",
  },
  {
    slug: "manonmaniam-sundaranar-university-tamil-nadu",
    name: "Manonmaniam Sundaranar University",
    shortName: "MSU",
    state: "Tamil Nadu",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/manonmaniam-sundaranar-university-tamil-nadu.webp",
  },
  {
    slug: "marwadi-university-online",
    name: "Marwadi University",
    shortName: "Marwadi University",
    state: "Gujarat",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/marwadi-university-online.svg",
  },
  {
    slug: "mats-university-online",
    name: "MATS University",
    shortName: "MATS University",
    state: "Chhattisgarh",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mats-university-online.webp",
  },
  {
    slug: "meenakshi-academy-of-higher-education-and-research-tamil-nadu",
    name: "Meenakshi Academy of Higher Education and Research",
    shortName: "MAHER",
    state: "Tamil Nadu",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/meenakshi-academy-of-higher-education-and-research-tamil-nadu.webp",
  },
  {
    slug: "mizoram-university-mizoram",
    name: "Mizoram University",
    shortName: "Mizoram University",
    state: "Mizoram",
    universityType: "Central University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mizoram-university-mizoram.webp",
  },
  {
    slug: "mody-university-of-science-and-technology-rajasthan",
    name: "Mody University of Science and Technology",
    shortName: "Mody University",
    state: "Rajasthan",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mody-university-of-science-and-technology-rajasthan.webp",
  },
  {
    slug: "mohan-babu-university-online",
    name: "Mohan Babu University",
    shortName: "MBU",
    state: "Andhra Pradesh",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/mohan-babu-university-online.webp",
  },
  {
    slug: "noida-international-university-uttar-pradesh",
    name: "Noida International University",
    shortName: "NIU",
    state: "Uttar Pradesh",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/noida-international-university-uttar-pradesh.svg",
  },
  {
    slug: "o-p-jindal-global-university-haryana",
    name: "O. P. Jindal Global University",
    shortName: "JGU",
    state: "Haryana",
    universityType: "Deemed-to-be University",
    evidenceCategory: "Official university programme page",
    referencePeriod: "Live university online-programme page accessed September 2026",
    sourceUrl: "https://jgu.edu.in/jgbs/courses?programme=online",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/o-p-jindal-global-university-haryana.webp",
  },
  {
    slug: "pp-savani-university-online",
    name: "P. P. Savani University",
    shortName: "PPSU",
    state: "Gujarat",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/pp-savani-university-online.webp",
  },
  {
    slug: "parul-university-online",
    name: "Parul University",
    shortName: "Parul University",
    state: "Gujarat",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/parul-university-online.svg",
  },
  {
    slug: "pt-sundarlal-sharma-open-university-chhattisgarh",
    name: "Pt. Sundarlal Sharma (Open) University",
    shortName: "PSSOU",
    state: "Chhattisgarh",
    universityType: "State Open University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/pt-sundarlal-sharma-open-university-chhattisgarh.webp",
  },
  {
    slug: "sage-university-online",
    name: "SAGE University",
    shortName: "SAGE University",
    state: "Madhya Pradesh",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sage-university-online.webp",
  },
  {
    slug: "sandip-university-maharashtra",
    name: "Sandip University",
    shortName: "Sandip University Nashik",
    state: "Maharashtra",
    universityType: "Private University",
    evidenceCategory: "UGC recognition list - third-party mirror",
    referencePeriod: "February 2026 onward",
    sourceUrl:
      "https://www.scribd.com/document/1075897337/140-Upload-RecognitionDetails-20260810153344",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sandip-university-maharashtra.webp",
  },
  {
    slug: "sathyabama-institute-of-science-and-technology-tamil-nadu",
    name: "Sathyabama Institute of Science and Technology",
    shortName: "Sathyabama",
    state: "Tamil Nadu",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sathyabama-institute-of-science-and-technology-tamil-nadu.webp",
  },
  {
    slug: "savitribai-phule-pune-university-maharashtra",
    name: "Savitribai Phule Pune University",
    shortName: "SPPU",
    state: "Maharashtra",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/savitribai-phule-pune-university-maharashtra.webp",
  },
  {
    slug: "shanmugha-arts-science-technology-and-research-academy-tamil-nadu",
    name: "Shanmugha Arts, Science, Technology and Research Academy",
    shortName: "SASTRA",
    state: "Tamil Nadu",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/shanmugha-arts-science-technology-and-research-academy-tamil-nadu.webp",
  },
  {
    slug: "sharda-university-uttar-pradesh",
    name: "Sharda University",
    shortName: "Sharda University",
    state: "Uttar Pradesh",
    universityType: "Private University",
    evidenceCategory: "UGC entitlement notice - university-hosted copy",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://shardaonline.ai/assets/sharda/ugc-deb-approval.pdf",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sharda-university-uttar-pradesh.webp",
  },
  {
    slug: "shiv-nadar-institution-of-eminence-deemed-to-be-university-uttar-pradesh",
    name: "Shiv Nadar (Institution of Eminence Deemed to be University)",
    shortName: "Shiv Nadar University Delhi NCR",
    state: "Uttar Pradesh",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC entitlement notice - university-hosted copy",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://shardaonline.ai/assets/sharda/ugc-deb-approval.pdf",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/shiv-nadar-institution-of-eminence-deemed-to-be-university-uttar-pradesh.webp",
  },
  {
    slug: "shivaji-university-maharashtra",
    name: "Shivaji University",
    shortName: "Shivaji University",
    state: "Maharashtra",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/shivaji-university-maharashtra.webp",
  },
  {
    slug: "shobhit-institute-of-engineering-and-technology-uttar-pradesh",
    name: "Shobhit Institute of Engineering and Technology",
    shortName: "Shobhit Deemed University Meerut",
    state: "Uttar Pradesh",
    universityType: "Deemed-to-be University",
    evidenceCategory: "University online portal plus earlier UGC-list mirror",
    referencePeriod:
      "University portal accessed September 2026; regulatory evidence for July-August 2025 and February 2026",
    sourceUrl: "https://shobhit.online/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/shobhit-institute-of-engineering-and-technology-uttar-pradesh.webp",
  },
  {
    slug: "sgt-university-online",
    name: "Shree Guru Gobind Singh Tricentenary University",
    shortName: "SGT University",
    state: "Haryana",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sgt-university-online.svg",
  },
  {
    slug: "shri-ramasamy-memorial-university-sikkim-sikkim",
    name: "Shri Ramasamy Memorial University, Sikkim",
    shortName: "SRM University Sikkim",
    state: "Sikkim",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/shri-ramasamy-memorial-university-sikkim-sikkim.webp",
  },
  {
    slug: "silver-oak-university-gujarat",
    name: "Silver Oak University",
    shortName: "SOU",
    state: "Gujarat",
    universityType: "Private University",
    evidenceCategory: "UGC recognition list - third-party mirror",
    referencePeriod: "February 2026 onward",
    sourceUrl:
      "https://www.scribd.com/document/1075897337/140-Upload-RecognitionDetails-20260810153344",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/silver-oak-university-gujarat.webp",
  },
  {
    slug: "sri-ramachandra-institute-of-higher-education-and-research-tamil-nadu",
    name: "Sri Ramachandra Institute of Higher Education and Research",
    shortName: "SRIHER",
    state: "Tamil Nadu",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sri-ramachandra-institute-of-higher-education-and-research-tamil-nadu.webp",
  },
  {
    slug: "sri-siddhartha-academy-of-higher-education-karnataka",
    name: "Sri Siddhartha Academy of Higher Education",
    shortName: "SSAHE",
    state: "Karnataka",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sri-siddhartha-academy-of-higher-education-karnataka.webp",
  },
  {
    slug: "sri-venkateswara-university-andhra-pradesh",
    name: "Sri Venkateswara University",
    shortName: "SVU",
    state: "Andhra Pradesh",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/sri-venkateswara-university-andhra-pradesh.webp",
  },
  {
    slug: "srinivas-university-karnataka",
    name: "Srinivas University",
    shortName: "Srinivas University",
    state: "Karnataka",
    universityType: "Private University",
    evidenceCategory: "UGC recognition list - third-party mirror",
    referencePeriod: "August 2026 onward",
    sourceUrl:
      "https://www.scribd.com/document/1075897337/140-Upload-RecognitionDetails-20260810153344",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/srinivas-university-karnataka.webp",
  },
  {
    slug: "srm-institute-of-science-and-technology-tamil-nadu",
    name: "SRM Institute of Science and Technology",
    shortName: "SRMIST",
    state: "Tamil Nadu",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/srm-institute-of-science-and-technology-tamil-nadu.svg",
  },
  {
    slug: "svkm-s-narsee-monjee-institute-of-management-studies-maharashtra",
    name: "SVKM's Narsee Monjee Institute of Management Studies",
    shortName: "NMIMS",
    state: "Maharashtra",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/svkm-s-narsee-monjee-institute-of-management-studies-maharashtra.webp",
  },
  {
    slug: "swami-rama-himalayan-university-uttarakhand",
    name: "Swami Rama Himalayan University",
    shortName: "SRHU",
    state: "Uttarakhand",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/swami-rama-himalayan-university-uttarakhand.webp",
  },
  {
    slug: "swami-vivekanand-subharti-university-uttar-pradesh",
    name: "Swami Vivekanand Subharti University",
    shortName: "SVSU",
    state: "Uttar Pradesh",
    universityType: "Private University",
    evidenceCategory: "UGC recognition list - third-party mirror",
    referencePeriod: "July-August 2025 onward",
    sourceUrl:
      "https://www.scribd.com/document/1075897337/140-Upload-RecognitionDetails-20260810153344",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/swami-vivekanand-subharti-university-uttar-pradesh.webp",
  },
  {
    slug: "symbiosis-international-deemed-university-maharashtra",
    name: "Symbiosis International (Deemed University)",
    shortName: "SIU",
    state: "Maharashtra",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/symbiosis-international-deemed-university-maharashtra.webp",
  },
  {
    slug: "teerthanker-mahaveer-university-uttar-pradesh",
    name: "Teerthanker Mahaveer University",
    shortName: "TMU",
    state: "Uttar Pradesh",
    universityType: "Private University",
    evidenceCategory: "UGC recognition list - third-party mirror",
    referencePeriod: "February 2025 onward; additional programme from February 2026",
    sourceUrl:
      "https://www.scribd.com/document/1075897337/140-Upload-RecognitionDetails-20260810153344",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/teerthanker-mahaveer-university-uttar-pradesh.webp",
  },
  {
    slug: "the-northcap-university-haryana",
    name: "The NorthCap University",
    shortName: "NCU",
    state: "Haryana",
    universityType: "Private University",
    evidenceCategory: "UGC recognition list - third-party mirror",
    referencePeriod: "July-August 2023 onward",
    sourceUrl:
      "https://www.scribd.com/document/1075897337/140-Upload-RecognitionDetails-20260810153344",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/the-northcap-university-haryana.webp",
  },
  {
    slug: "university-of-calicut-kerala",
    name: "University of Calicut",
    shortName: "Calicut University",
    state: "Kerala",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-calicut-kerala.webp",
  },
  {
    slug: "university-of-jammu-online",
    name: "University of Jammu",
    shortName: "University of Jammu",
    state: "Jammu and Kashmir",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-jammu-online.webp",
  },
  {
    slug: "university-of-kerala-online",
    name: "University of Kerala",
    shortName: "Kerala University",
    state: "Kerala",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-kerala-online.svg",
  },
  {
    slug: "university-of-lucknow-uttar-pradesh",
    name: "University of Lucknow",
    shortName: "Lucknow University",
    state: "Uttar Pradesh",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-lucknow-uttar-pradesh.webp",
  },
  {
    slug: "university-of-madras-tamil-nadu",
    name: "University of Madras",
    shortName: "University of Madras",
    state: "Tamil Nadu",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-madras-tamil-nadu.svg",
  },
  {
    slug: "university-of-mumbai-maharashtra",
    name: "University of Mumbai",
    shortName: "Mumbai University",
    state: "Maharashtra",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-mumbai-maharashtra.svg",
  },
  {
    slug: "university-of-mysore-online",
    name: "University of Mysore",
    shortName: "University of Mysore",
    state: "Karnataka",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-mysore-online.webp",
  },
  {
    slug: "university-of-petroleum-and-energy-studies-uttarakhand",
    name: "University of Petroleum and Energy Studies",
    shortName: "UPES",
    state: "Uttarakhand",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/university-of-petroleum-and-energy-studies-uttarakhand.webp",
  },
  {
    slug: "vellore-institute-of-technology-tamil-nadu",
    name: "Vellore Institute of Technology",
    shortName: "VIT",
    state: "Tamil Nadu",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/vellore-institute-of-technology-tamil-nadu.webp",
  },
  {
    slug: "vels-institute-of-science-technology-and-advanced-studies-tamil-nadu",
    name: "Vels Institute of Science, Technology and Advanced Studies",
    shortName: "VISTAS",
    state: "Tamil Nadu",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/vels-institute-of-science-technology-and-advanced-studies-tamil-nadu.webp",
  },
  {
    slug: "vtu-online",
    name: "Visvesvaraya Technological University",
    shortName: "VTU",
    state: "Karnataka",
    universityType: "State University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/vtu-online.webp",
  },
  {
    slug: "vivekananda-global-university-rajasthan",
    name: "Vivekananda Global University",
    shortName: "VGU",
    state: "Rajasthan",
    universityType: "Private University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/vivekananda-global-university-rajasthan.webp",
  },
  {
    slug: "yenepoya-university-online",
    name: "Yenepoya (Deemed to be University)",
    shortName: "Yenepoya",
    state: "Karnataka",
    universityType: "Deemed-to-be University",
    evidenceCategory: "UGC-entitled list - secondary compilation",
    referencePeriod: "AY 2025-26; February 2026",
    sourceUrl: "https://careerbracket.com/verify-university/",
    checkedOn: "2026-09-12",
    nextReviewAt: "2026-10-12T23:59:59+05:30",
    logoUrl:
      "https://tzhjdxewkwjftuofaelk.supabase.co/storage/v1/object/public/university-logos/v1/yenepoya-university-online.webp",
  },
];

export const directoryUniversities = directoryInputs.map(createDirectoryUniversity);
