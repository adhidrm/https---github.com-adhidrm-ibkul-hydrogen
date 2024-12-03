// ($slug)._index.tsx
import {
  Content,
  fetchOneEntry,
  getBuilderSearchParams,
  isPreviewing,
// } from '@builder.io/sdk-react';
} from '@builder.io/sdk-react/edge';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React from 'react';
import { BuilderContent } from '@builder.io/sdk-react/edge';

// const apiKey = process.env.BUILDER_IO_API_KEY || 'default-api-key';
if (!process.env.BUILDER_IO_API_KEY) {
	throw new Error('Missing BUILDER_IO_API_KEY');
  }
  const apiKey = process.env.BUILDER_IO_API_KEY;
  

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  try {
	const url = new URL(request.url);
	const urlPath = `/${params['slug'] || ''}`;

	const page = await fetchOneEntry({
	  model: 'page',
	  apiKey,
	  options: getBuilderSearchParams(url.searchParams),
	  userAttributes: { urlPath },
	});

	if (!page && !isPreviewing(url.search)) {
	  throw new Response('Page Not Found', {
		status: 404,
		statusText: 'Page not found in Builder.io',
	  });
	}

	return { page };
  } catch (error) {
	console.error(error);
	throw new Response('Error fetching page', {
	  status: 500,
	  statusText: 'Error fetching page from Builder.io',
	});
  }
};

// Define and render the page.
export default function Page() {
  // Use the useLoaderData hook to get the Page data from `loader` above.
  const { page } = useLoaderData<typeof loader>();

  // Render the page content from Builder.io
//   return <Content model="page" apiKey={apiKey} content={page} />;
return <Content model="page" apiKey={apiKey} content={page as BuilderContent} />;
}