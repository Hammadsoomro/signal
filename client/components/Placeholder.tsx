import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description: string;
}

export function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <Card className="max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Construction className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This page is ready to be implemented. Continue prompting to add the full functionality for this section.
          </p>
          <Button variant="outline" disabled>
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
