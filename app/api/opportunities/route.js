export async function GET() {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  const url = `https://api.airtable.com/v0/${baseId}/tbltSLnrCqwaxG12h?filterByFormula=%7Bstatus%7D%3D%22Published%22`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    return Response.json(
      { error: errorText },
      { status: response.status }
    );
  }

  const data = await response.json();
  return Response.json(data);
}
