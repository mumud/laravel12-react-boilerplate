import { Button } from '@/components/ui/button';
import moment from 'moment';
import { useState } from 'react';

export interface IActivity {
    description: string;
    created_at: string;
    causer?: {
        name: string;
    };
}

export default function ActivityLog({ activities }: { activities: IActivity[] }) {
    const [showAll, setShowAll] = useState(false);
    const visibleActivities = showAll ? activities : activities.slice(0, 3);

    return (
        <div className="w-full rounded-md border p-4">
            <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Activity</h3>
                {activities.length > 3 && (
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setShowAll(!showAll)}>
                        {showAll ? 'Hide activity' : 'Show all activity'}
                    </Button>
                )}
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
                {visibleActivities.length > 0 ? (
                    visibleActivities.map((activity, index) => (
                        <li key={index} className="flex flex-col">
                            <span className="leading-tight">
                                {activity.description === 'created' ? 'You created this' : 'You edited this'}
                                {activity.causer?.name ? ` by ${activity.causer.name}` : ''} · {moment(activity.created_at).fromNow()}
                            </span>
                        </li>
                    ))
                ) : (
                    <li className="text-xs italic">No activity recorded.</li>
                )}
            </ul>
        </div>
    );
}
