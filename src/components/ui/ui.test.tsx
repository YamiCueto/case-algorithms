import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { changeLanguage } from '@/i18n';
import {
  Button,
  Badge,
  Card,
  ThemeToggle,
  AppHeader,
  LabShell,
  TimeTravelControls,
  PedagogicalKnowledgePanel,
  PlaybackIcon,
} from './index';

describe('Design System UI Components', () => {
  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    await act(async () => {
      await changeLanguage('es');
    });
  });

  describe('Button component', () => {
    it('renders with default props and handles click events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('respects disabled state', () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      const button = screen.getByRole('button', { name: /disabled/i });
      expect(button).toBeDisabled();
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('renders different visual variants', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-primary');

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-outline');
    });
  });

  describe('Badge component', () => {
    it('renders text with appropriate variant class', () => {
      render(<Badge variant="emerald">v0.1</Badge>);
      const badge = screen.getByText('v0.1');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('badge-emerald');
    });
  });

  describe('Card component', () => {
    it('renders title and content properly', () => {
      render(
        <Card title="Inspector Panel" subtitle="Live State">
          <div>Card Content</div>
        </Card>
      );

      expect(screen.getByText('Inspector Panel')).toBeInTheDocument();
      expect(screen.getByText('Live State')).toBeInTheDocument();
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });
  });

  describe('ThemeToggle component', () => {
    it('toggles between dark and light themes and updates data-theme attribute', () => {
      render(<ThemeToggle />);
      const toggleBtn = screen.getByRole('button');

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      fireEvent.click(toggleBtn);
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(localStorage.getItem('case_theme')).toBe('light');

      fireEvent.click(toggleBtn);
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorage.getItem('case_theme')).toBe('dark');
    });

    it('falls back to dark theme if localStorage contains an invalid value', () => {
      localStorage.setItem('case_theme', 'invalid_theme');
      render(<ThemeToggle />);
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('renders localized aria-label and title in Spanish and English', async () => {
      const { rerender } = render(<ThemeToggle />);
      const btn = screen.getByRole('button');

      expect(btn).toHaveAttribute('aria-label', 'Cambiar a tema claro');
      expect(btn).toHaveAttribute('title', 'Cambiar a tema claro');

      await act(async () => {
        await changeLanguage('en');
      });

      rerender(<ThemeToggle />);
      expect(btn).toHaveAttribute('aria-label', 'Switch to light theme');
      expect(btn).toHaveAttribute('title', 'Switch to light theme');
    });
  });

  describe('AppHeader component', () => {
    it('renders banner landmark, brand, and breadcrumb hierarchy', () => {
      render(<AppHeader breadcrumbs={['Laboratory', 'Foundation', 'Shell']} />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByText('CASE Algorithms')).toBeInTheDocument();
      expect(screen.getByText('Foundation')).toBeInTheDocument();
      expect(screen.getByText('Shell')).toBeInTheDocument();
    });
  });

  describe('LabShell component', () => {
    it('renders main landmark, viewport, controls, and knowledge slots for backwards compatibility', () => {
      render(
        <LabShell
          title="Stack Laboratory"
          subtitle="LIFO Interactive Exploration"
          viewportSlot={<div data-testid="viewport-content">Viewport Canvas</div>}
          controlsSlot={<div data-testid="controls-content">Control Buttons</div>}
          knowledgeSlot={<div data-testid="knowledge-content">Knowledge Tabs</div>}
        />
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /stack laboratory/i })).toBeInTheDocument();
      expect(screen.getByTestId('viewport-content')).toBeInTheDocument();
      expect(screen.getByTestId('controls-content')).toBeInTheDocument();
      expect(screen.getByTestId('knowledge-content')).toBeInTheDocument();
    });

    it('renders all dual-stage slots: visualization, code, time-travel, controls, inspector, and knowledge', () => {
      render(
        <LabShell
          category="Data Structures"
          title="Dual Stage Laboratory"
          subtitle="Synchronized Viewport and Code"
          visualizationSlot={<div data-testid="viz-stage">SVG Canvas</div>}
          codeSlot={<div data-testid="code-stage">Code Surface</div>}
          timeTravelSlot={<div data-testid="tt-stage">Time Travel Bar</div>}
          controlsSlot={<div data-testid="controls-stage">Inputs & Buttons</div>}
          inspectorSlot={<div data-testid="inspector-stage">State Inspector</div>}
          knowledgeSlot={<div data-testid="knowledge-stage">10 Dimensions</div>}
        />
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText('Data Structures')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /dual stage laboratory/i })).toBeInTheDocument();
      expect(screen.getByTestId('viz-stage')).toBeInTheDocument();
      expect(screen.getByTestId('code-stage')).toBeInTheDocument();
      expect(screen.getByTestId('tt-stage')).toBeInTheDocument();
      expect(screen.getByTestId('controls-stage')).toBeInTheDocument();
      expect(screen.getByTestId('inspector-stage')).toBeInTheDocument();
      expect(screen.getByTestId('knowledge-stage')).toBeInTheDocument();
    });
  });

  describe('TimeTravelControls component', () => {
    it('renders all buttons and responds to click events', () => {
      const onFirst = vi.fn();
      const onPrevious = vi.fn();
      const onTogglePlay = vi.fn();
      const onNext = vi.fn();
      const onLast = vi.fn();
      const onReset = vi.fn();
      const onSpeedChange = vi.fn();

      const onSeek = vi.fn();

      render(
        <TimeTravelControls
          isPlaying={false}
          currentIndex={2}
          totalSteps={10}
          playbackSpeed={600}
          onFirst={onFirst}
          onPrevious={onPrevious}
          onTogglePlay={onTogglePlay}
          onNext={onNext}
          onLast={onLast}
          onReset={onReset}
          onSpeedChange={onSpeedChange}
          onSeek={onSeek}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /(jump to first step|ir al primer paso)/i }));
      expect(onFirst).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /(step backwards|retroceder un paso)/i }));
      expect(onPrevious).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /(play auto execution|reproducir ejecución automática)/i }));
      expect(onTogglePlay).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /(step forward|avanzar un paso)/i }));
      expect(onNext).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /(jump to last step|ir al último paso)/i }));
      expect(onLast).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /(reset to initial step|reiniciar al paso inicial)/i }));
      expect(onReset).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: '2x' }));
      expect(onSpeedChange).toHaveBeenCalledWith(250);
    });

    it('disables boundary buttons correctly at start and end', () => {
      const { rerender } = render(
        <TimeTravelControls
          isPlaying={false}
          currentIndex={0}
          totalSteps={5}
          playbackSpeed={600}
          onFirst={vi.fn()}
          onPrevious={vi.fn()}
          onTogglePlay={vi.fn()}
          onNext={vi.fn()}
          onLast={vi.fn()}
          onReset={vi.fn()}
          onSpeedChange={vi.fn()}
          onSeek={vi.fn()}
        />
      );

      expect(screen.getByRole('button', { name: /(jump to first step|ir al primer paso)/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /(step backwards|retroceder un paso)/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /(step forward|avanzar un paso)/i })).not.toBeDisabled();

      rerender(
        <TimeTravelControls
          isPlaying={false}
          currentIndex={4}
          totalSteps={5}
          playbackSpeed={600}
          onFirst={vi.fn()}
          onPrevious={vi.fn()}
          onTogglePlay={vi.fn()}
          onNext={vi.fn()}
          onLast={vi.fn()}
          onReset={vi.fn()}
          onSpeedChange={vi.fn()}
          onSeek={vi.fn()}
        />
      );

      expect(screen.getByRole('button', { name: /(step forward|avanzar un paso)/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /(jump to last step|ir al último paso)/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /(step backwards|retroceder un paso)/i })).not.toBeDisabled();
    });

    it('renders timeline scrubber with correct min, max, value, and disabled states', () => {
      const handleSeek = vi.fn();
      const { rerender } = render(
        <TimeTravelControls
          isPlaying={false}
          currentIndex={2}
          totalSteps={10}
          playbackSpeed={600}
          onFirst={vi.fn()}
          onPrevious={vi.fn()}
          onTogglePlay={vi.fn()}
          onNext={vi.fn()}
          onLast={vi.fn()}
          onReset={vi.fn()}
          onSpeedChange={vi.fn()}
          onSeek={handleSeek}
        />
      );

      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
      expect(slider).toHaveAttribute('min', '0');
      expect(slider).toHaveAttribute('max', '9');
      expect(slider).toHaveAttribute('step', '1');
      expect(slider).toHaveValue('2');
      expect(slider).not.toBeDisabled();

      // Trigger slider onChange with discrete numeric value
      fireEvent.change(slider, { target: { value: '6' } });
      expect(handleSeek).toHaveBeenCalledWith(6);

      // When totalSteps <= 1, slider should be disabled
      rerender(
        <TimeTravelControls
          isPlaying={false}
          currentIndex={0}
          totalSteps={1}
          playbackSpeed={600}
          onFirst={vi.fn()}
          onPrevious={vi.fn()}
          onTogglePlay={vi.fn()}
          onNext={vi.fn()}
          onLast={vi.fn()}
          onReset={vi.fn()}
          onSpeedChange={vi.fn()}
          onSeek={handleSeek}
        />
      );
      expect(slider).toBeDisabled();
      expect(slider).toHaveAttribute('max', '0');

      rerender(
        <TimeTravelControls
          isPlaying={false}
          currentIndex={0}
          totalSteps={0}
          playbackSpeed={600}
          onFirst={vi.fn()}
          onPrevious={vi.fn()}
          onTogglePlay={vi.fn()}
          onNext={vi.fn()}
          onLast={vi.fn()}
          onReset={vi.fn()}
          onSpeedChange={vi.fn()}
          onSeek={handleSeek}
        />
      );
      expect(slider).toBeDisabled();
    });

    it('renders localized progress text and accessibility attributes in Spanish and English', async () => {
      const { rerender } = render(
        <TimeTravelControls
          isPlaying={false}
          currentIndex={2}
          totalSteps={10}
          playbackSpeed={600}
          onFirst={vi.fn()}
          onPrevious={vi.fn()}
          onTogglePlay={vi.fn()}
          onNext={vi.fn()}
          onLast={vi.fn()}
          onReset={vi.fn()}
          onSpeedChange={vi.fn()}
          onSeek={vi.fn()}
        />
      );

      // In Spanish: "Paso 3 de 10"
      expect(screen.getByText('Paso 3 de 10')).toBeInTheDocument();
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-label', 'Línea de tiempo de pasos de ejecución');
      expect(slider).toHaveAttribute('aria-valuetext', 'Paso 3 de 10');

      await act(async () => {
        await changeLanguage('en');
      });

      rerender(
        <TimeTravelControls
          isPlaying={false}
          currentIndex={2}
          totalSteps={10}
          playbackSpeed={600}
          onFirst={vi.fn()}
          onPrevious={vi.fn()}
          onTogglePlay={vi.fn()}
          onNext={vi.fn()}
          onLast={vi.fn()}
          onReset={vi.fn()}
          onSpeedChange={vi.fn()}
          onSeek={vi.fn()}
        />
      );

      expect(screen.getByText('Step 3 of 10')).toBeInTheDocument();
      expect(slider).toHaveAttribute('aria-label', 'Execution steps timeline');
      expect(slider).toHaveAttribute('aria-valuetext', 'Step 3 of 10');

      // Reset language back to Spanish
      await act(async () => {
        await changeLanguage('es');
      });
    });

    it('renders transport buttons with decorative icons, no visible text, and correct accessible names', () => {
      render(
        <TimeTravelControls
          isPlaying={false}
          currentIndex={2}
          totalSteps={10}
          playbackSpeed={600}
          onFirst={vi.fn()}
          onPrevious={vi.fn()}
          onTogglePlay={vi.fn()}
          onNext={vi.fn()}
          onLast={vi.fn()}
          onReset={vi.fn()}
          onSpeedChange={vi.fn()}
          onSeek={vi.fn()}
        />
      );

      // Verify the 6 buttons preserve their accessible names
      const firstBtn = screen.getByRole('button', { name: 'Ir al primer paso' });
      const prevBtn = screen.getByRole('button', { name: 'Retroceder un paso' });
      const playBtn = screen.getByRole('button', { name: 'Reproducir ejecución automática' });
      const nextBtn = screen.getByRole('button', { name: 'Avanzar un paso' });
      const lastBtn = screen.getByRole('button', { name: 'Ir al último paso' });
      const resetBtn = screen.getByRole('button', { name: 'Reiniciar al paso inicial' });

      expect(firstBtn).toBeInTheDocument();
      expect(prevBtn).toBeInTheDocument();
      expect(playBtn).toBeInTheDocument();
      expect(nextBtn).toBeInTheDocument();
      expect(lastBtn).toBeInTheDocument();
      expect(resetBtn).toBeInTheDocument();

      // All 6 transport buttons have class 'time-travel-icon-button'
      [firstBtn, prevBtn, playBtn, nextBtn, lastBtn, resetBtn].forEach((btn) => {
        expect(btn).toHaveClass('time-travel-icon-button');
        // SVG inside is decorative with aria-hidden="true"
        const svg = btn.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('exposes aria-pressed on Play/Pause button according to isPlaying state', () => {
      const { rerender } = render(
        <TimeTravelControls
          isPlaying={false}
          currentIndex={2}
          totalSteps={10}
          playbackSpeed={600}
          onFirst={vi.fn()}
          onPrevious={vi.fn()}
          onTogglePlay={vi.fn()}
          onNext={vi.fn()}
          onLast={vi.fn()}
          onReset={vi.fn()}
          onSpeedChange={vi.fn()}
          onSeek={vi.fn()}
        />
      );

      const playBtn = screen.getByRole('button', { name: 'Reproducir ejecución automática' });
      expect(playBtn).toHaveAttribute('aria-pressed', 'false');
      expect(playBtn.querySelector('.playback-icon-play')).toBeInTheDocument();

      rerender(
        <TimeTravelControls
          isPlaying={true}
          currentIndex={2}
          totalSteps={10}
          playbackSpeed={600}
          onFirst={vi.fn()}
          onPrevious={vi.fn()}
          onTogglePlay={vi.fn()}
          onNext={vi.fn()}
          onLast={vi.fn()}
          onReset={vi.fn()}
          onSpeedChange={vi.fn()}
          onSeek={vi.fn()}
        />
      );

      const pauseBtn = screen.getByRole('button', { name: 'Pausar ejecución' });
      expect(pauseBtn).toHaveAttribute('aria-pressed', 'true');
      expect(pauseBtn.querySelector('.playback-icon-pause')).toBeInTheDocument();
    });

    it('exposes aria-pressed=true exclusively for the active playback speed', () => {
      const { rerender } = render(
        <TimeTravelControls
          isPlaying={false}
          currentIndex={2}
          totalSteps={10}
          playbackSpeed={600}
          onFirst={vi.fn()}
          onPrevious={vi.fn()}
          onTogglePlay={vi.fn()}
          onNext={vi.fn()}
          onLast={vi.fn()}
          onReset={vi.fn()}
          onSpeedChange={vi.fn()}
          onSeek={vi.fn()}
        />
      );

      const speed05 = screen.getByRole('button', { name: '0.5x' });
      const speed1x = screen.getByRole('button', { name: '1x' });
      const speed2x = screen.getByRole('button', { name: '2x' });

      expect(speed05).toHaveAttribute('aria-pressed', 'false');
      expect(speed1x).toHaveAttribute('aria-pressed', 'true');
      expect(speed2x).toHaveAttribute('aria-pressed', 'false');

      rerender(
        <TimeTravelControls
          isPlaying={false}
          currentIndex={2}
          totalSteps={10}
          playbackSpeed={250}
          onFirst={vi.fn()}
          onPrevious={vi.fn()}
          onTogglePlay={vi.fn()}
          onNext={vi.fn()}
          onLast={vi.fn()}
          onReset={vi.fn()}
          onSpeedChange={vi.fn()}
          onSeek={vi.fn()}
        />
      );

      expect(speed05).toHaveAttribute('aria-pressed', 'false');
      expect(speed1x).toHaveAttribute('aria-pressed', 'false');
      expect(speed2x).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('PlaybackIcon component', () => {
    const iconNames = ['first', 'previous', 'play', 'pause', 'next', 'last', 'reset'] as const;

    it.each(iconNames)('renders "%s" icon as decorative SVG with aria-hidden="true"', (name) => {
      const { container } = render(<PlaybackIcon name={name} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('focusable', 'false');
      expect(svg).toHaveClass(`playback-icon-${name}`);
    });
  });

  describe('PedagogicalKnowledgePanel component', () => {
    const mockPhases = [
      { id: '01', name: '01. Discover', title: 'Discover Phase', content: 'Discover overview text' },
      { id: '06', name: '06. Pseudocode', title: 'Pseudocode Phase', content: 'line 1\nline 2' },
      { id: '07', name: '07. Code', title: 'Code Phase', content: 'const a = 1;\nconst b = 2;' },
    ];

    it('renders tabs and responds to selection', () => {
      const handleSelect = vi.fn();
      render(
        <PedagogicalKnowledgePanel
          phases={mockPhases}
          activePhaseIndex={0}
          onPhaseSelect={handleSelect}
        />
      );

      expect(screen.getByText('Discover Phase')).toBeInTheDocument();
      expect(screen.getByText('Discover overview text')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /06\. pseudocode/i }));
      expect(handleSelect).toHaveBeenCalledWith(1);
    });

    it('renders CodeViewer for pseudocode and typescript phases', () => {
      const { rerender } = render(
        <PedagogicalKnowledgePanel
          phases={mockPhases}
          activePhaseIndex={1}
          onPhaseSelect={vi.fn()}
          pseudocodeActiveLine={2}
        />
      );

      expect(screen.getByText('Pseudocode')).toBeInTheDocument();
      expect(screen.getByText(/Line 2 Active/i)).toBeInTheDocument();

      rerender(
        <PedagogicalKnowledgePanel
          phases={mockPhases}
          activePhaseIndex={2}
          onPhaseSelect={vi.fn()}
          typescriptActiveLine={1}
        />
      );

      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText(/Line 1 Active/i)).toBeInTheDocument();
    });
  });
});
