import { KeyboardEvent } from 'react';
import { ThemePreference, useTheme } from '../state/ThemeContext';

const OPTIONS: Array<{ value: ThemePreference; label: string; icon: JSX.Element; title: string }> = [
  {
    value: 'light',
    label: 'Light',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4.5" fill="currentColor" />
        <path
          d="M12 2v2.4M12 19.6V22M4.4 4.4 6.1 6.1M17.9 17.9l1.7 1.7M2 12h2.4M19.6 12H22M4.4 19.6 6.1 17.9M17.9 6.1l1.7-1.7"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
        />
      </svg>
    ),
    title: 'Use light theme'
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M20.75 15.5A8.75 8.75 0 0 1 8.5 3.25 7.25 7.25 0 1 0 20.75 15.5Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
        />
      </svg>
    ),
    title: 'Use dark theme'
  },
  {
    value: 'system',
    label: 'System',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
        />
        <path
          d="M15 4.5H9A4.5 4.5 0 0 0 4.5 9v6A4.5 4.5 0 0 0 9 19.5h6A4.5 4.5 0 0 0 19.5 15V9A4.5 4.5 0 0 0 15 4.5Z"
          fill="currentColor"
          opacity="0.22"
        />
        <path
          d="M15.5 8.5a3.5 3.5 0 1 1-4.99 4.9"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
        />
      </svg>
    ),
    title: 'Sync with system appearance'
  }
];

const ThemeToggle = () => {
  const { preference, theme, setPreference } = useTheme();

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowDown' && event.key !== 'ArrowLeft' && event.key !== 'ArrowUp') {
      return;
    }

    event.preventDefault();
    const increment = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (index + increment + OPTIONS.length) % OPTIONS.length;
    setPreference(OPTIONS[nextIndex].value);
  };

  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Appearance">
      {OPTIONS.map((option, index) => {
        const isActive = preference === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={`theme-toggle__option${isActive ? ' theme-toggle__option--active' : ''}`}
            role="radio"
            aria-checked={isActive}
            data-active={isActive ? 'true' : 'false'}
            tabIndex={isActive ? 0 : -1}
            title={option.title}
            onClick={() => setPreference(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span className="theme-toggle__icon" aria-hidden="true">
              {option.icon}
            </span>
            <span className="theme-toggle__label">{option.label}</span>
            {option.value === 'system' && (
              <span className="theme-toggle__caption">{theme === 'dark' ? 'Dark now' : 'Light now'}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
