import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { APPLICATION_MENU } from '@/lib/constant';

interface AppMenuProps {
  //
}

const AppMenu: React.FC<AppMenuProps> = () => {
  return (
    <div className='flex-row items-center justify-start hidden gap-4 lg:flex'>
      <NavigationMenu className='flex items-start justify-start'>
        <NavigationMenuList className='flex flex-row justify-start gap-4'>
          {APPLICATION_MENU.map((menu) => {
            return (
              <NavigationMenuItem key={menu.title}>
                <NavigationMenuTrigger className='text-sm font-medium'>{menu.title}</NavigationMenuTrigger>
                <NavigationMenuContent className='!w-[500px] p-4'>
                  <div className='flex flex-col grid-cols-3 gap-4 lg:grid'>
                    <div className='flex flex-col justify-between h-full'>
                      <div className='flex flex-col space-y-2'>
                        <p className='font-medium'>{menu.title}</p>
                        <p className='text-sm text-muted-foreground'>{menu.description}</p>
                      </div>
                    </div>

                    <div className='flex flex-col justify-end h-full col-span-2 text-sm'>
                      {menu.items.map((subItem) => (
                        <NavigationMenuLink
                          href={subItem.href}
                          key={subItem.title}
                          className='flex flex-col items-start justify-between px-4 py-2 rounded-md hover:bg-muted'>
                          <span>{subItem.title}</span>
                          {subItem.description && (
                            <p className='text-sm text-muted-foreground'>{subItem.description}</p>
                          )}
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default AppMenu;
