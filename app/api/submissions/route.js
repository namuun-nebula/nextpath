export async function POST(request) {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const submissionsTableId = "tblxEtA2JlFWOIJuA";

  try {
    const body = await request.json();

    const fields = {
      Type: body.type || "",
      Name: body.name || "",
      Organization: body.organization || "",
      Link: body.link || "",
      Category: body.category || "",
      Audience: body.audience || "",
      Deadline: body.deadline || undefined,
      Notes: body.notes || "",
      "Related Opportunity": body.relatedOpportunity || "",
    };

    Object.keys(fields).forEach((key) => {
      if (fields[key] === "" || fields[key] === undefined) delete fields[key];
    });

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${submissionsTableId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
