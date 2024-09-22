import * as React from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

import { Button } from './ui/button';
import { Clipboard } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface DetailModalProps extends React.PropsWithChildren {
  title: string;
  description: string;
  details: Array<{
    key: string;
    value: string;
    long?: boolean;
  }>;
}

const DetailModal: React.FC<DetailModalProps> = ({ title, description, details, children }) => {
  const { toast } = useToast();

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: 'Copied',
      description: 'The value has been copied to your clipboard',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className='grid gap-4'>
          <div className='grid gap-4 text-sm lg:grid-cols-2'>
            {details.map((detail, idx) => {
              const Component = detail.long ? Textarea : Input;

              return (
                <div
                  key={idx}
                  className={cn(
                    'flex flex-col space-y-2',
                    (detail.long || detail.key.includes('ID')) && 'col-span-full'
                  )}>
                  <Label className='block'>{detail.key}</Label>
                  <div className='relative'>
                    <Component
                      readOnly
                      className='text-muted-foreground'
                      defaultValue={detail.key.includes('ID') ? detail.value.toUpperCase() : detail.value}
                    />
                    <div className='absolute right-0 p-2 transform -translate-y-1/2 cursor-pointer me-1 top-1/2 '>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Clipboard
                              className='size-3 text-muted-foreground'
                              onClick={() => handleCopy(detail.value)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy to clipboard</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className='mt-4 sm:justify-end'>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
