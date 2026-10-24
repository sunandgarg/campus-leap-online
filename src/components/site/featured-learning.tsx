import { ArrowDown, BadgeCheck, LockKeyhole } from "lucide-react";
import courses from "@/data/featured-learning.json";
import { LeadForm } from "@/components/site/lead-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function FeaturedLearning() {
  return (
    <aside
      id="featured-learning"
      className="skills-highlight"
      aria-labelledby="featured-learning-title"
    >
      <p className="skills-kicker">
        <BadgeCheck className="h-4 w-4 shrink-0" /> Beyond your degree
      </p>
      <h3
        id="featured-learning-title"
        className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl"
      >
        Make room for your next skill.
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Free starters and focused courses for your next step.
      </p>
      <p className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
        <LockKeyhole className="h-3.5 w-3.5 shrink-0" /> Submit an enquiry before visiting a
        provider.
      </p>
      <div
        className="skills-course-list mt-4"
        role="region"
        aria-label="Skill courses, scroll for more"
        tabIndex={0}
      >
        {courses.map((course) => (
          <Dialog key={course.id}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="skills-course w-full text-left"
                aria-label={`Enquire about ${course.title} from ${course.provider}`}
              >
                <span className="skills-provider">
                  <img
                    src={course.logo}
                    alt={`${course.provider} logo`}
                    width="74"
                    height="28"
                    loading="lazy"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="skills-category">{course.category}</span>
                  <strong className="skills-course-title">{course.title}</strong>
                  <span
                    className="mt-0.5 block truncate text-[10px] leading-4 text-muted-foreground"
                    title={course.detail}
                  >
                    {course.detail}
                  </span>
                </span>
                <span className="skills-pricing" data-price={course.pricing}>
                  {course.pricing}
                </span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-h-[90dvh] w-[calc(100%-24px)] overflow-y-auto rounded-2xl p-5 sm:max-w-lg sm:p-6">
              <div className="pr-5">
                <img
                  src={course.logo}
                  alt={course.provider}
                  width="74"
                  height="28"
                  className="mb-4 h-9 w-24 rounded bg-white p-1.5 object-contain"
                />
                <DialogTitle className="text-xl font-extrabold leading-7">
                  {course.title}
                </DialogTitle>
                <DialogDescription className="mt-2 text-xs leading-6">
                  Send your enquiry to DekhoCampus first. After it is saved, you can continue to{" "}
                  {course.provider}. Your contact details are not automatically shared with the
                  provider. This is a {course.pricing.toLowerCase()} course; confirm the current
                  terms with the provider.
                </DialogDescription>
              </div>
              <LeadForm externalCourseId={course.id} compact className="border-0 py-0 md:py-0" />
            </DialogContent>
          </Dialog>
        ))}
      </div>
      <p className="mt-2 flex items-center justify-center gap-1 text-[10px] font-semibold text-muted-foreground">
        Scroll for more courses <ArrowDown className="h-3 w-3" aria-hidden="true" />
      </p>
      <p className="mt-3 text-[10px] leading-5 text-muted-foreground">
        Independent provider courses, not bundled degree benefits or partnerships. Check current
        fees, eligibility and terms. No placement guarantee.
      </p>
    </aside>
  );
}
