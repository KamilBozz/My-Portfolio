import 'server-only';

import { neon } from '@neondatabase/serverless';
import { randomUUID } from 'crypto';

const db = neon(process.env.DATABASE_URL);

const seedProject = [
    {
        id: randomUUID(),
        title: "Project One",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        img: "/project.jpg",
        link: "https://www.google.com"
        },
      {
          id: randomUUID(),
          title: "Project Two",
          desc: "Short blurb.",
          img: "/project.jpg",
          link: "https://www.google.com"
          },
          
      {
          id: randomUUID(),
          title: "Project Three",
          desc: "Short blurb.",
          img: "https://placehold.co/300.png",
          link: "https://www.google.com"
          },
]

async function ensureProjectsTable() {
    await db`
      CREATE TABLE IF NOT EXISTS projects (
        id uuid PRIMARY KEY,
        title text NOT NULL,
        description text NOT NULL,
        img text NOT NULL,
        link text NOT NULL,
        keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
  
    const [{ count }] = await db`SELECT COUNT(*)::int AS count FROM projects`;
    if (Number(count) === 0) {
      await seedProjectsTable();
    }
  }
  
  async function seedProjectsTable() {
    for (const project of seedProject) {
      await db`
        INSERT INTO projects (id, title, description, img, link, keywords)
        VALUES (
          ${project.id}::uuid,
          ${project.title},
          ${project.desc || project.description},
          ${project.img},
          ${project.link},
          ${JSON.stringify(normalizeKeywordsInput(project.keywords || []))}::jsonb
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }
  
  function normalizeKeywordsInput(value) {
    if (!value) return [];
    const list = Array.isArray(value) ? value : String(value).split(',');
    return list
      .map((keyword) => keyword?.toString().trim())
      .filter((keyword) => Boolean(keyword));
  }
  
  const PROJECT_STRING_FIELDS = ['title', 'description', 'img', 'link'];
  
  function pickProjectFields(input = {}) {
    return PROJECT_STRING_FIELDS.reduce((acc, field) => {
      if (input[field] !== undefined) {
        const value = input[field];
        acc[field] = typeof value === 'string' ? value.trim() : value;
      }
      return acc;
    }, {});
  }
  
  function mapRow(row) {
    return {
      ...row,
      keywords: Array.isArray(row.keywords)
        ? row.keywords
        : normalizeKeywordsInput(row.keywords),
    };
  }
  
  export async function fetchProjects() {
    try {
      await ensureProjectsTable();
      const rows = await db`
        SELECT
          id,
          title,
          description,
          img,
          link,
          keywords,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM projects
        ORDER BY created_at DESC
      `;
    
      return rows.map(mapRow);
    } catch (error) {
      console.error("Database error in fetchProjects:", error);
      throw error;
    }
  }
  
  export async function getProjectById(id) {
    await ensureProjectsTable();
    const rows = await db`
      SELECT
        id,
        title,
        description,
        img,
        link,
        keywords,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM projects
      WHERE id = ${id}::uuid
      LIMIT 1
    `;
  
    if (rows.length === 0) {
      return null;
    }
  
    return mapRow(rows[0]);
  }
  
  export async function insertProject(project) {
    await ensureProjectsTable();
    const id = project.id ?? randomUUID();
    const keywords = normalizeKeywordsInput(project.keywords);
  
    const [row] = await db`
      INSERT INTO projects (id, title, description, img, link, keywords)
      VALUES (
        ${id}::uuid,
        ${project.title},
        ${project.description},
        ${project.img},
        ${project.link},
        ${JSON.stringify(keywords)}::jsonb
      )
      RETURNING
        id,
        title,
        description,
        img,
        link,
        keywords,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;
  
    return mapRow(row);
  }
  
  export async function updateProject(id, updates = {}) {
    await ensureProjectsTable();
    const currentRows = await db`
      SELECT
        id,
        title,
        description,
        img,
        link,
        keywords,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM projects
      WHERE id = ${id}::uuid
      LIMIT 1
    `;
  
    if (currentRows.length === 0) {
      return null;
    }
  
    const current = mapRow(currentRows[0]);
    const sanitized = pickProjectFields(updates);
    const nextKeywords =
      updates.keywords !== undefined
        ? normalizeKeywordsInput(updates.keywords)
        : current.keywords;
  
    const payload = {
      title: sanitized.title ?? current.title,
      description: sanitized.description ?? current.description,
      img: sanitized.img ?? current.img,
      link: sanitized.link ?? current.link,
      keywords: nextKeywords,
    };
  
    const [row] = await db`
      UPDATE projects
      SET
        title = ${payload.title},
        description = ${payload.description},
        img = ${payload.img},
        link = ${payload.link},
        keywords = ${JSON.stringify(payload.keywords)}::jsonb,
        updated_at = now()
      WHERE id = ${id}::uuid
      RETURNING
        id,
        title,
        description,
        img,
        link,
        keywords,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;
  
    return mapRow(row);
  }
  
  export async function deleteProject(id) {
    await ensureProjectsTable();
    const rows = await db`
      DELETE FROM projects
      WHERE id = ${id}::uuid
      RETURNING
        id,
        title,
        description,
        img,
        link,
        keywords,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;
  
    if (rows.length === 0) {
      return null;
    }
  
    return mapRow(rows[0]);
  }
  
  export { fetchProjects as getProjects };

// Hero helpers
export const HERO_PLACEHOLDER_AVATAR = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

export const defaultHeroContent = {
  avatar: HERO_PLACEHOLDER_AVATAR,
  fullName: "...",
  shortDescription: "...",
  longDescription: "...",
};

async function ensureHeroTable() {
  await db`
    CREATE TABLE IF NOT EXISTS hero (
      id uuid PRIMARY KEY,
      avatar text NOT NULL DEFAULT '',
      full_name text NOT NULL,
      short_description text NOT NULL CHECK (char_length(short_description) <= 120),
      long_description text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  const [{ count }] = await db`SELECT COUNT(*)::int AS count FROM hero`;
  if (Number(count) === 0) {
    await seedHeroTable();
  }
}

async function seedHeroTable() {
  const id = randomUUID();
  await db`
    INSERT INTO hero (id, avatar, full_name, short_description, long_description)
    VALUES (
      ${id}::uuid,
      ${defaultHeroContent.avatar},
      ${defaultHeroContent.fullName},
      ${defaultHeroContent.shortDescription},
      ${defaultHeroContent.longDescription}
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

function mapHeroRow(row) {
  return {
    id: row.id,
    avatar: row.avatar || HERO_PLACEHOLDER_AVATAR,
    fullName: row.full_name || defaultHeroContent.fullName,
    shortDescription: row.short_description || defaultHeroContent.shortDescription,
    longDescription: row.long_description || defaultHeroContent.longDescription,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getHero() {
  try {
    await ensureHeroTable();
    const [row] = await db`
      SELECT
        id,
        avatar,
        full_name,
        short_description,
        long_description,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM hero
      ORDER BY created_at ASC
      LIMIT 1
    `;

    return row ? mapHeroRow(row) : null;
  } catch (error) {
    console.error("Database error in getHero:", error);
    throw error;
  }
}

export async function upsertHero(updates = {}) {
  await ensureHeroTable();

  const current = await getHero();

  // Merge defaults → current → updates
  const merged = {
    avatar: updates.avatar !== undefined ? updates.avatar : (current?.avatar || defaultHeroContent.avatar),
    fullName: updates.fullName !== undefined ? updates.fullName : (current?.fullName || defaultHeroContent.fullName),
    shortDescription: updates.shortDescription !== undefined 
      ? updates.shortDescription.slice(0, 120) 
      : (current?.shortDescription || defaultHeroContent.shortDescription),
    longDescription: updates.longDescription !== undefined 
      ? updates.longDescription 
      : (current?.longDescription || defaultHeroContent.longDescription),
  };

  // Normalize: trim strings, ensure avatar is not empty
  const normalized = {
    avatar: (merged.avatar || '').trim() || HERO_PLACEHOLDER_AVATAR,
    fullName: (merged.fullName || '').trim() || defaultHeroContent.fullName,
    shortDescription: (merged.shortDescription || '').trim().slice(0, 120) || defaultHeroContent.shortDescription,
    longDescription: (merged.longDescription || '').trim() || defaultHeroContent.longDescription,
  };

  if (current) {
    // UPDATE existing row
    const [row] = await db`
      UPDATE hero
      SET
        avatar = ${normalized.avatar},
        full_name = ${normalized.fullName},
        short_description = ${normalized.shortDescription},
        long_description = ${normalized.longDescription},
        updated_at = now()
      WHERE id = ${current.id}::uuid
      RETURNING
        id,
        avatar,
        full_name,
        short_description,
        long_description,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;
    return mapHeroRow(row);
  } else {
    // INSERT new row
    const id = randomUUID();
    const [row] = await db`
      INSERT INTO hero (id, avatar, full_name, short_description, long_description)
      VALUES (
        ${id}::uuid,
        ${normalized.avatar},
        ${normalized.fullName},
        ${normalized.shortDescription},
        ${normalized.longDescription}
      )
      RETURNING
        id,
        avatar,
        full_name,
        short_description,
        long_description,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;
    return mapHeroRow(row);
  }
}