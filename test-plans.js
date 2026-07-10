async function test() {
  try {
    const res = await fetch("http://localhost:3001/api/v1/plans");
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
test();