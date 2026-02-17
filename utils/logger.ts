export const logSQL = (
  action: string,
  success: boolean,
  startTime: number,
  data?: any,
) => {
  const duration = (performance.now() - startTime).toFixed(2);
  const icon = success ? "✅" : "❌";
  const label = success ? "SUCCESS" : "ERROR";

  console.log(
    `%c[SQL] ${icon} ${label} | ${action} | ${duration}ms`,
    "color: #4CAF50; font-weight: bold;",
  );
  if (data) console.log("   └─ Data:", data);
};
