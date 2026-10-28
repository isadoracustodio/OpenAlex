export interface OpenAlexInstitution {
    id: string;
    ror: string | null;
    display_name: string | null;
    country_code: string | null;
    type?: string | null;
}

export interface OpenAlexAuthor {
    id: string;
    display_name: string;
    orcid: string | null;
}

export interface OpenAlexAuthorship {
    author_position: string;
    author: OpenAlexAuthor;
    institutions: OpenAlexInstitution[]
}

export interface OpenAlexWork {
    id: string;
    doi: string | null;
    title: string | null;
    publication_year: number | null;
    type: string | null;
    language: string | null;
    cited_by_count: number;
    is_xpac?: boolean;
    open_access?: { oa_status: string | null } | null;
    primary_location?: { source?: { display_name: string | null } | null } | null;
    primary_topic?: { display_name: string } | null;
    authorships: OpenAlexAuthorship[];
}

export interface OpenAlexListResponse<T> {
    meta: { count: number; next_cursor: string | null };
    results: T[];
}