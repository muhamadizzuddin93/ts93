import React from 'react';
import { Trophy, Star, Zap, Target, Award, TrendingUp, Users, Calendar } from 'lucide-react';
import { User, Badge, Achievement, Leaderboard } from '../../types';
import { mockAchievements, mockLeaderboard } from '../../data/mockData';

interface GamificationDashboardProps {
  user: User;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ user }) => {
  const userAchievements = mockAchievements.filter(a => a.userId === user.id);
  const userRank = mockLeaderboard.find(l => l.userId === user.id);
  
  const getXPForNextLevel = (currentLevel: number) => {
    return currentLevel * 300; // 300 XP per level
  };

  const getCurrentLevelXP = (totalPoints: number, level: number) => {
    const previousLevelXP = (level - 1) * 300;
    return totalPoints - previousLevelXP;
  };

  const nextLevelXP = getXPForNextLevel(user.level);
  const currentLevelXP = getCurrentLevelXP(user.totalPoints, user.level);
  const progressPercentage = (currentLevelXP / nextLevelXP) * 100;

  const getBadgeIcon = (badge: Badge) => {
    return badge.icon || '🏆';
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600 bg-purple-100';
    if (streak >= 14) return 'text-orange-600 bg-orange-100';
    if (streak >= 7) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  const recentAchievements = userAchievements
    .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">Level {user.level}</h3>
            <p className="text-blue-100">Keep up the great work!</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{user.totalPoints.toLocaleString()}</div>
            <div className="text-blue-100">Total Points</div>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between text-sm text-blue-100 mb-1">
            <span>Progress to Level {user.level + 1}</span>
            <span>{currentLevelXP}/{nextLevelXP} XP</span>
          </div>
          <div className="w-full bg-blue-400 bg-opacity-30 rounded-full h-3">
            <div
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${Math.min(100, progressPercentage)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className={`text-2xl font-bold px-2 py-1 rounded-full inline-block ${getStreakColor(user.streak)}`}>
                {user.streak}
              </p>
            </div>
            <Zap className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Badges Earned</p>
              <p className="text-2xl font-bold text-yellow-600">{user.badges.length}</p>
            </div>
            <Award className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Leaderboard Rank</p>
              <p className="text-2xl font-bold text-green-600">#{userRank?.rank || 'N/A'}</p>
            </div>
            <Trophy className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Weekly Points</p>
              <p className="text-2xl font-bold text-purple-600">{userRank?.weeklyPoints || 0}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
          </div>
          
          {recentAchievements.length > 0 ? (
            <div className="space-y-3">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-yellow-600 font-medium">+{achievement.points} points</span>
                      <span className="text-xs text-gray-500">
                        {new Date(achievement.earnedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No recent achievements</p>
              <p className="text-sm text-gray-400">Complete tasks to earn your first achievement!</p>
            </div>
          )}
        </div>

        {/* Badges Collection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900">Badge Collection</h3>
          </div>
          
          {user.badges.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {user.badges.map((badge) => (
                <div key={badge.id} className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
                  <div className="text-2xl mb-2">{getBadgeIcon(badge)}</div>
                  <h4 className="font-medium text-gray-900 text-sm">{badge.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                  <p className="text-xs text-purple-600 mt-1">
                    {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No badges earned yet</p>
              <p className="text-sm text-gray-400">Complete challenges to earn badges!</p>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="w-5 h-5 text-gold-500" />
          <h3 className="text-lg font-semibold text-gray-900">Leaderboard</h3>
        </div>
        
        <div className="space-y-2">
          {mockLeaderboard.slice(0, 6).map((entry, index) => (
            <div
              key={entry.userId}
              className={`flex items-center justify-between p-3 rounded-lg ${
                entry.userId === user.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                  index === 1 ? 'bg-gray-100 text-gray-800' :
                  index === 2 ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {entry.rank}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{entry.userName}</p>
                  <p className="text-sm text-gray-600">{entry.department}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{entry.totalPoints.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Level {entry.level}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Tips */}
      <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Daily Goals</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="font-medium">Submit Timesheet Early</p>
            <p className="text-sm text-green-100">Submit before 9 AM for bonus points!</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="font-medium">Complete Tasks</p>
            <p className="text-sm text-green-100">Finish 3 tasks today for achievement!</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="font-medium">Maintain Streak</p>
            <p className="text-sm text-green-100">Keep your {user.streak}-day streak going!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationDashboard;