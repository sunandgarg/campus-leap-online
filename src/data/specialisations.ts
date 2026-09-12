import {
  programCatalog,
  specialisationCatalog,
  universitiesOfferingSpecialisation,
  type ProgramTemplate,
} from "@/data/universities";

export interface SpecialisationRecord {
  slug: string;
  name: string;
  program: ProgramTemplate;
  universityCount: number;
  skills: string[];
  careerDirections: string[];
  summary: string;
  category?: string | undefined;
  taxonomySlug?: string | undefined;
  sortOrder: number;
}

export function slugifySpecialisation(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getSignals(name: string, program: ProgramTemplate) {
  const value = name.toLowerCase();

  if (/(ai|machine learning|data|analytics|business intelligence)/.test(value)) {
    return {
      skills: ["Data interpretation", "Applied statistics", "AI workflows", "Decision modelling"],
      careerDirections: ["Data & analytics", "Business intelligence", "AI-enabled operations"],
    };
  }
  if (/(finance|bank|account|fintech|tax)/.test(value)) {
    return {
      skills: ["Financial analysis", "Risk thinking", "Reporting", "Commercial decision-making"],
      careerDirections: ["Finance", "Banking", "Financial operations"],
    };
  }
  if (/(marketing|brand|digital|communication|journal)/.test(value)) {
    return {
      skills: [
        "Audience research",
        "Campaign planning",
        "Communication",
        "Performance measurement",
      ],
      careerDirections: ["Marketing", "Growth", "Content & communications"],
    };
  }
  if (/(human resource|hr|people|counselling|social)/.test(value)) {
    return {
      skills: ["People operations", "Communication", "Programme design", "Stakeholder management"],
      careerDirections: ["People & culture", "Learning and development", "Programme operations"],
    };
  }
  if (/(cloud|cyber|software|full stack|technology|computer)/.test(value)) {
    return {
      skills: ["Systems thinking", "Software delivery", "Cloud workflows", "Security awareness"],
      careerDirections: ["Software & platforms", "Cloud operations", "Technology consulting"],
    };
  }
  if (/(operations|supply|logistics|project)/.test(value)) {
    return {
      skills: ["Process design", "Quality improvement", "Planning", "Operational analytics"],
      careerDirections: ["Operations", "Supply chain", "Project coordination"],
    };
  }

  return {
    skills: ["Domain foundations", "Research", "Communication", "Applied problem-solving"],
    careerDirections: program.careers.slice(0, 3),
  };
}

export function getAllSpecialisations(): SpecialisationRecord[] {
  return programCatalog
    .flatMap((program, programIndex) => {
      const taxonomyForProgram = specialisationCatalog.filter((specialisation) =>
        specialisation.programSlugs.includes(program.slug),
      );
      const mappedLabels = taxonomyForProgram.flatMap((specialisation) =>
        specialisation.programLabels
          .filter((mapping) => mapping.programSlug === program.slug)
          .map((mapping) => mapping.label),
      );
      const names = [...new Set([...program.specialisations, ...mappedLabels])];

      return names.map((name, nameIndex) => {
        const normalizedName = slugifySpecialisation(name);
        const taxonomy = taxonomyForProgram.find(
          (candidate) =>
            slugifySpecialisation(candidate.name) === normalizedName ||
            slugifySpecialisation(candidate.slug) === normalizedName ||
            candidate.programLabels.some(
              (mapping) =>
                mapping.programSlug === program.slug &&
                slugifySpecialisation(mapping.label) === normalizedName,
            ),
        );
        const signals = getSignals(name, program);
        return {
          slug: `${program.slug.replace(/^online-/, "")}-${slugifySpecialisation(name)}`,
          name,
          program,
          universityCount: universitiesOfferingSpecialisation(program.slug, name).length,
          skills: taxonomy?.skills.length ? taxonomy.skills : signals.skills,
          careerDirections: taxonomy?.careerDirections.length
            ? taxonomy.careerDirections
            : signals.careerDirections,
          summary:
            taxonomy?.summary ??
            `${name} within an online ${program.code} focuses your degree on role-relevant knowledge while keeping the broader ${program.name} foundation. Compare curriculum depth, assessment format and university support before choosing it.`,
          category: taxonomy?.category,
          taxonomySlug: taxonomy?.slug,
          sortOrder: taxonomy?.sortOrder ?? 10_000 + programIndex * 1_000 + nameIndex,
        };
      });
    })
    .filter(
      (specialisation, index, rows) =>
        rows.findIndex((candidate) => candidate.slug === specialisation.slug) === index,
    )
    .sort(
      (a, b) =>
        a.sortOrder - b.sortOrder ||
        a.program.name.localeCompare(b.program.name) ||
        a.name.localeCompare(b.name),
    );
}

export function getSpecialisation(slug: string): SpecialisationRecord | undefined {
  return getAllSpecialisations().find((specialisation) => specialisation.slug === slug);
}
