/**
 * Whether search engines may index this build. Off by default so preview /
 * staging deploys never compete with the live Squarespace site; enable with
 * PUBLIC_ALLOW_INDEXING=true for the production launch.
 */
export const allowIndexing = import.meta.env.PUBLIC_ALLOW_INDEXING === 'true';
