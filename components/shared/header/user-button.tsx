import Link from 'next/link'; 
import { auth } from '@/auth';
import { signOutUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button'
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuTrigger,
    DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
import { UserIcon } from 'lucide-react'; 

const UserButton = async () => {
    const session = await auth(); 

    if (!session) {
        return (
            <Button asChild style={{ borderRadius: '8px' }}>
                <Link href="/sign-in">
                    <UserIcon /> Sign-in
                </Link>
            </Button>
        );
    };

    const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? 'U'; 

    return (
        <div className='flex gap-2 items-center'>
            <DropdownMenu>
                <DropdownMenuTrigger 
                    className='relative w-8 h-8 rounded-full ml-2 flex items-center 
                    justify-center bg-gray-200 hover:bg-gray-300 cursor-pointer border-0'
                >
                    {firstInitial}
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end'>
                    <DropdownMenuGroup>
                        <DropdownMenuLabel className='font-normal'>
                            <div className='flex flex-col space-y-1'>
                                <div className="text-sm font-medium leading-none">
                                    <strong>{session.user?.name}</strong>
                                </div>
                                <div className="text-sm text-muted-foreground leading-none">
                                    {session.user?.email}
                                </div>
                            </div>
                        </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuItem className='p-0 mb-1'>
                        <form action={ signOutUser } className='w-full'>
                            <Button 
                                type='submit' 
                                className='w-full py-4 px-2 h-4 justify-start' 
                                style={{ borderRadius: '8px' }}
                                variant='ghost'
                            >
                                Sign Out
                            </Button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
 
export default UserButton;