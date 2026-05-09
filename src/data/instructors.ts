export type Instructor = {
  slug: string;
  name: string;
  focus: string;
  region: string;
  bio: string;
  image: string;
};

export const instructors: Instructor[] = [
  {
    slug: "james-wilson",
    name: "Dr. James Wilson",
    focus: "Psychology Expert",
    region: "International Faculty",
    bio: "Known for a calm, highly structured teaching style and a strong focus on practical psychology foundations.",
    image:
      "https://i.pinimg.com/1200x/8b/67/9a/8b679a8e85572fa52abe386fb703c7db.jpg",
  },
  {
    slug: "maria-santos",
    name: "Maria Santos",
    focus: "Leadership Coach",
    region: "Global Leadership",
    bio: "Brings an encouraging, mentor-driven approach that keeps leadership training practical and approachable.",
    image:
      "https://i.pinimg.com/736x/a7/f1/ac/a7f1ac4af5f5a703ec5ae1f1db141ff4.jpg",
  },
  {
    slug: "alan-chen",
    name: "Dr. Alan Chen",
    focus: "Mental Health Specialist",
    region: "Global Faculty",
    bio: "Focuses on accessible mental health education with a clear, supportive style.",
    image:
      "https://i.pinimg.com/736x/14/cf/41/14cf41381e366c2597d010e90546914c.jpg",
  },
];
