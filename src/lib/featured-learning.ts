import courses from "@/data/featured-learning.json";

export function getLearningCourse(id: unknown) {
  return typeof id === "string" ? courses.find((course) => course.id === id) : undefined;
}

export function learningContinuation(id: string, response: { ok: boolean; continueUrl?: string }) {
  const course = getLearningCourse(id);
  return response.ok && course && response.continueUrl === course.href ? course.href : null;
}
