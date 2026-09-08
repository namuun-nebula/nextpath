export async function GET() {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/Opportunities?filterByFormula=Status%3D%22Published%22`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    return Response.json(
      { error: "Failed to fetch opportunities" },
      { status: response.status }
    );
  }

  const data = await response.json();

  return Response.json(data);
}