interface RegenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

// 重新生成按钮
export default function RegenerateButton({ onClick, disabled = false }: RegenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-white text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 disabled:opacity-50"
    >
      {disabled ? '生成中...' : '重新生成'}
    </button>
  );
}
