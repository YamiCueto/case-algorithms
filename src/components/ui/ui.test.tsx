import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Button,
  Badge,
  Card,
  ThemeToggle,
  AppHeader,
  LabShell,
  TimeTravelControls,
  PedagogicalKnowledgePanel,
} from './index';

describe('Design System UI Components', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
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
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /jump to first step/i }));
      expect(onFirst).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /step backwards/i }));
      expect(onPrevious).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /play auto execution/i }));
      expect(onTogglePlay).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /step forward/i }));
      expect(onNext).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /jump to last step/i }));
      expect(onLast).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /reset to initial step/i }));
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
        />
      );

      expect(screen.getByRole('button', { name: /jump to first step/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /step backwards/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /step forward/i })).not.toBeDisabled();

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
        />
      );

      expect(screen.getByRole('button', { name: /step forward/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /jump to last step/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /step backwards/i })).not.toBeDisabled();
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
