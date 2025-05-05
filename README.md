# ✈️ Nomadoo - Travel App

Nomadoo is a comprehensive travel planning application designed to help users organize all aspects of their trips in one place. From flights and accommodations to daily itineraries, Nomadoo serves as a centralized hub for travel organization.

## Project Overview

Nomadoo aims to simplify the travel planning process by eliminating the need to switch between multiple apps or booking sites. The application provides a structured task system that helps both novice travelers and professional tourists plan their trips effectively.

### Key Features (Planned)

- Trip itinerary management
- Flight and hotel database integration
- Calendar synchronization
- Smart notifications
- Activity recommendations storage and categorization
- Interactive map integration with Mapbox
- User authentication and profile management

## Mapbox Integration

### Features

- Interactive world map for trip planning
- Location search and geocoding

### Getting Started with Mapbox

Set up your Mapbox access token in the environment variables:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

## Development Status

🚧 **This project is currently under development. The features and implementation details are subject to change as the project evolves.**

## Technology Stack

### Core Technologies

- Next.js 15.2.4
- React 19
- TypeScript
- Tailwind CSS

## Project Structure

```
src/
├── app/          # Next.js app directory
├── components/   # Reusable UI components
├── pages/        # Page components
├── config/       # Configuration files
└── types/        # TypeScript type definitions
```

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Create a .env file with the following variables
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
# Add other required environment variables
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Future Plans

- Integration with travel booking APIs
- Partner program implementation
- User feedback system
- Mobile-responsive design
- Multi-language support

## Contributing

This project is in its early stages. Contributions and suggestions are welcome as we continue to develop and refine the application.
