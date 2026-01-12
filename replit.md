# Employee Self-Service Portal (بوابة الموظفين)

## Overview

An Arabic-language employee self-service portal that allows employees to check their leave balances and submit leave requests. The system features a modern, RTL (Right-to-Left) interface designed for Arabic users with a professional deep blue and gold color palette.

Key features:
- Employee lookup by employee ID
- Annual leave balance display
- Leave request submission
- Admin interface for adding new employees

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for complex animations and transitions
- **Build Tool**: Vite

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` (Home, Admin, NotFound)
- Reusable components in `client/src/components/`
- UI primitives from shadcn/ui in `client/src/components/ui/`
- Custom hooks in `client/src/hooks/`

RTL Support: The application is designed for Arabic language with RTL layout. Uses the 'Tajawal' font family for professional Arabic typography.

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Style**: RESTful JSON API

The backend follows a layered architecture:
- `server/index.ts` - Express app setup and middleware
- `server/routes.ts` - API route definitions
- `server/storage.ts` - Data access layer (repository pattern)
- `server/db.ts` - Database connection

### Data Layer
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Schema Location**: `shared/schema.ts`
- **Migrations**: `migrations/` directory (via `drizzle-kit push`)

Database tables:
- `employees` - Employee records with ID, name, and annual leave balance
- `leaveRequests` - Leave request records with dates, reason, and status

### Shared Code
- `shared/schema.ts` - Drizzle schema definitions and Zod validation schemas
- `shared/routes.ts` - API route definitions with type-safe input/output schemas

### Development vs Production
- **Development**: Vite dev server with HMR, served through Express
- **Production**: Static files built by Vite, served by Express from `dist/public`

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage (available but not currently used for auth)

### UI Component Libraries
- **shadcn/ui**: Pre-built accessible components based on Radix UI primitives
- **Radix UI**: Headless UI primitives for dialogs, menus, forms, etc.
- **Lucide React**: Icon library

### Validation
- **Zod**: Runtime type validation for API inputs
- **drizzle-zod**: Generates Zod schemas from Drizzle table definitions

### Build Tools
- **Vite**: Frontend bundler with React plugin
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development

### Fonts
- **Google Fonts**: Tajawal font for Arabic typography (loaded via CDN in index.html)