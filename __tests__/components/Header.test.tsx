import { render, screen, fireEvent } from '@testing-library/react'
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
  it('deve renderizar o header corretamente', () => {
    render(<Header />)
    
    // Verificar se o logo está presente
    expect(screen.getByText('Visa2Any')).toBeInTheDocument()
    expect(screen.getByTestId('globe-icon')).toBeInTheDocument()
    
    // Verificar se a navegação desktop está presente
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Serviços')).toBeInTheDocument()
    expect(screen.getByText('Preços')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('IA Consultoria')).toBeInTheDocument()
    expect(screen.getByText('Contato')).toBeInTheDocument()
  })

  it('deve mostrar o botão de menu mobile', () => {
    render(<Header />)
    
    // Verificar se o botão de menu está presente
    const menuButton = screen.getByTestId('menu-icon').closest('button')
    expect(menuButton).toBeInTheDocument()
  })

  it('deve abrir e fechar o menu mobile', () => {
    render(<Header />)
    
    const menuButton = screen.getByTestId('menu-icon').closest('button')
    
    // Menu deve estar fechado inicialmente
    expect(screen.queryByText('Login Cliente')).not.toBeInTheDocument()
    
    // Abrir menu
    fireEvent.click(menuButton!)
    expect(screen.getByText('Login Cliente')).toBeInTheDocument()
    
    // Verificar se o ícone mudou para X
    expect(screen.getByTestId('x-icon')).toBeInTheDocument()
    
    // Fechar menu
    const closeButton = screen.getByTestId('x-icon').closest('button')
    fireEvent.click(closeButton!)
    
    // Menu deve estar fechado novamente
    expect(screen.queryByText('Login Cliente')).not.toBeInTheDocument()
  })

  it('deve ter links corretos na navegação', () => {
    render(<Header />)
    
    // Verificar links da navegação
    expect(screen.getByRole('link', { name: /início/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /preços/i })).toHaveAttribute('href', '/precos')
    expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute('href', '/blog')
    expect(screen.getByRole('link', { name: /ia consultoria/i })).toHaveAttribute('href', '/consultoria-ia')
  })

  it('deve ter o botão CTA principal', () => {
    render(<Header />)
    
    // Verificar se o botão principal está presente
    expect(screen.getByText('Pré-Análise Gratuita')).toBeInTheDocument()
    expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument()
    
    // Verificar se o link está correto
    const ctaLink = screen.getByText('Pré-Análise Gratuita').closest('a')
    expect(ctaLink).toHaveAttribute('href', '/consultoria-ia')
  })

  it('deve fechar menu mobile ao clicar em um link', () => {
    render(<Header />)
    
    // Abrir menu mobile
    const menuButton = screen.getByTestId('menu-icon').closest('button')
    fireEvent.click(menuButton!)
    
    // Verificar se o menu está aberto
    expect(screen.getByText('Login Cliente')).toBeInTheDocument()
    
    // Clicar em um link do menu
    const inicioLink = screen.getAllByText('Início')[1] // O segundo é do menu mobile
    fireEvent.click(inicioLink)
    
    // Menu deve estar fechado
    expect(screen.queryByText('Login Cliente')).not.toBeInTheDocument()
  })

  it('deve ter elementos de acessibilidade corretos', () => {
    render(<Header />)
    
    // Verificar se o header tem a tag correta
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    
    // Verificar se a navegação tem a tag correta
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    
    // Verificar se os links são acessíveis
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    
    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('deve ter classes CSS responsivas', () => {
    render(<Header />)
    
    // Verificar classes responsivas no header
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('fixed', 'w-full', 'top-0', 'z-50')
    
    // Verificar navegação desktop
    const desktopNav = screen.getByRole('navigation')
    expect(desktopNav.querySelector('.hidden.md\\:flex')).toBeInTheDocument()
    
    // Verificar botão mobile
    const mobileButton = screen.getByTestId('menu-icon').closest('button')
    expect(mobileButton).toHaveClass('md:hidden')
  })
})