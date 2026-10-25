import { getAllSpecialisations } from "@/data/specialisations";
import {
  programCatalog,
  universities,
  universitiesOfferingProgram,
  universitiesOfferingSpecialisation,
  type University,
} from "@/data/universities";
import { coursePath, universityPath } from "@/lib/online-paths";

const universityOrder = [
  "amity-university-online",
  "lpu-online",
  "manipal-university-online",
  "chandigarh-university-online",
  "jain-university-online",
];
const degreeOrder = ["MBA", "MCA", "M.Com", "BBA", "BCA", "B.Com"];
const aiSpecialisation = /artificial intelligence|machine learning|^ai\b/i;

export function getHeaderNavigation() {
  const universityLinks = [...universities]
    .sort((a, b) => {
      const aIndex = universityOrder.indexOf(a.slug);
      const bIndex = universityOrder.indexOf(b.slug);
      return (
        (aIndex < 0 ? Infinity : aIndex) - (bIndex < 0 ? Infinity : bIndex) ||
        a.name.localeCompare(b.name)
      );
    })
    .map((university) => ({
      label: university.name,
      href: universityPath(university),
      university,
    }));
  const degrees = [...programCatalog].sort((a, b) => {
    const aIndex = degreeOrder.indexOf(a.code);
    const bIndex = degreeOrder.indexOf(b.code);
    return (
      (aIndex < 0 ? Infinity : aIndex) - (bIndex < 0 ? Infinity : bIndex) ||
      a.name.localeCompare(b.name)
    );
  });
  const records = getAllSpecialisations();
  const specialisations = [...new Set(records.map((item) => item.name))]
    .filter((name) => !/^general$/i.test(name) && !aiSpecialisation.test(name))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ name, records: records.filter((item) => item.name === name) }));
  const aiRecords = records.filter((item) => aiSpecialisation.test(item.name));
  if (aiRecords.length) specialisations.unshift({ name: "AI & ML", records: aiRecords });
  return { universityLinks, degrees, specialisations };
}

export function getHeaderDegreeUniversities(programSlug: string) {
  return universitiesOfferingProgram(programSlug).map(({ university, program }) => ({
    label: university.name,
    href: coursePath(university, program.slug),
    university,
  }));
}

export function getHeaderSpecialisationEntries(name: string) {
  return getAllSpecialisations()
    .filter((item) => (name === "AI & ML" ? aiSpecialisation.test(item.name) : item.name === name))
    .flatMap<{ label: string; href: string; university: University | undefined }>((item) => {
      const offers = universitiesOfferingSpecialisation(item.program.slug, item.name);
      return offers.length
        ? offers.map(({ university, program }) => ({
            label: `Online ${program.code} · ${item.name}`,
            href: `${coursePath(university, program.slug)}#other-specialisations`,
            university,
          }))
        : [
            {
              label: `Online ${item.program.code} · ${item.name}`,
              href: `/specialisations/${item.slug}`,
              university: undefined,
            },
          ];
    });
}
