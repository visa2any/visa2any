import { render, screen, fireEvent, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from '@/components/Header'

// Mock do Lucide React icons
jest.mock('lucide-react', () => ({
  Globe: () => <div data-testid="globe-icon">Globe</div>,
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  X: () => <div data-testid="x-icon">X</div>,
  ArrowRight: () => <div data-testid="arrow-right-icon">ArrowRight</div>,
  LogIn: () => <div data-testid="login-icon">LogIn</div>,
}))

describe('Header Component', () => {
  it('renders header correctly', () => {
    render(<Header />)
    
    expect(screen.getByText('Visa2Any')).toBeInTheDocument()
    expect(screen.getByTestId('globe-icon')).toBeInTheDocument()
    
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Serviços')).toBeInTheDocument()
    expect(screen.getByText('Preços')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('IA Consultoria')).toBeInTheDocument()
    expect(screen.getByText('Contato')).toBeInTheDocument()
  })

  it('shows mobile menu button', () => {
    render(<Header />)
    const menuIcon = screen.getByTestId('menu-icon')
    const menuButton = menuIcon.closest('button')
    expect(menuButton).toBeInTheDocument()
  })

  it('opens and closes mobile menu', () => {
    render(<Header />)
    const menuIcon = screen.getByTestId('menu-icon')
    const menuButton = menuIcon.closest('button')
    if (!menuButton) throw new Error('Menu button not found')

    expect(screen.queryByText('Login Cliente')).not.toBeInTheDocument()
    fireEvent.click(menuButton)
    expect(screen.getByText('Login Cliente')).toBeInTheDocument()
    
    const closeIcon = screen.getByTestId('x-icon')
    const closeButton = closeIcon.closest('button')
    if (!closeButton) throw new Error('Close button not found')
    fireEvent.click(closeButton)
    
    expect(screen.queryByText('Login Cliente')).not.toBeInTheDocument()
  })

  it('has correct navigation links', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /início/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /preços/i })).toHaveAttribute('href', '/precos')
    expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute('href', '/blog')
    expect(screen.getByRole('link', { name: /ia consultoria/i })).toHaveAttribute('href', '/consultoria-ia')
  })

  it('has main CTA button', () => {
    render(<Header />)
    const ctaText = screen.getByText('Pré-Análise Gratuita')
    const ctaLink = ctaText.closest('a')
    if (!ctaLink) throw new Error('CTA link not found')
    expect(ctaLink).toHaveAttribute('href', '/consultoria-ia')
  })

  it('closes mobile menu when clicking link', () => {
    render(<Header />)
    const menuIcon = screen.getByTestId('menu-icon')
    const menuButton = menuIcon.closest('button')
    if (!menuButton) throw new Error('Menu button not found')
    fireEvent.click(menuButton)
    
    const mobileLinks = screen.getAllByText('Início')
    if (mobileLinks.length < 2) throw new Error('Mobile menu link not found')
    const mobileLink = mobileLinks[1]
    if (!mobileLink) throw new Error('Mobile link element not found')
    fireEvent.click(mobileLink)
    
    expect(screen.queryByText('Login Cliente')).not.toBeInTheDocument()
  })

  it('has correct accessibility elements', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('has responsive CSS classes', () => {
    render(<Header />)
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('fixed', 'w-full', 'top-0', 'z-50')
    
    const desktopNav = screen.getByRole('navigation')
    const desktopNavItems = within(desktopNav).getAllByRole('link')
    expect(desktopNavItems.length).toBeGreaterThan(0)
    
    const menuIcon = screen.getByTestId('menu-icon')
    const mobileButton = menuIcon.closest('button')
    if (!mobileButton) throw new Error('Mobile button not found')
    expect(mobileButton).toHaveClass('md:hidden')
  })
})
