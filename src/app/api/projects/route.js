// GET /api/projects
export async function GET() {
    const projects = [
        {
          title: "Project One",
          desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          img: "/project.jpg",
          link: "#"
          },
        {
            title: "Project Two",
            desc: "Short blurb.",
            img: "/project.jpg",
            link: "#"
            },
            
        {
            title: "Project Three",
            desc: "Short blurb.",
            img: "https://placehold.co/300.png",
            link: "#"
            },  
      ];

    return Response.json({ projects });
  }
  