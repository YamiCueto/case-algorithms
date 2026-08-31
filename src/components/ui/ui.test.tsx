import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, Badge, Card, ThemeToggle, AppHeader, LabShell } from './index';

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
  });

  describe('AppHeader component', () => {
    it('renders banner landmark and platform title', () => {
      render(<AppHeader breadcrumbs={['Lab', 'Core']} />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByText('CASE Algorithms')).toBeInTheDocument();
    });
  });

  describe('LabShell component', () => {
    it('renders main landmark, viewport, controls, and knowledge slots', () => {
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
  });
});
