type TableEmptyRowProps = {
  colSpan: number;
  message?: string;
  detail?: string;
};

export function TableEmptyRow({
  colSpan,
  message = "No records found.",
  detail = "Try adjusting your filters.",
}: TableEmptyRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-8 text-center">
        <p className="text-sm font-semibold text-[var(--color-ink-soft)]">
          {message}
        </p>
        {detail ? (
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{detail}</p>
        ) : null}
      </td>
    </tr>
  );
}
