export const LineItemOuterContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-gray-300 pl-4 dark:border-gray-600 sm:pl-5">
        {children}
      </div>
    </div>
  );
};

export const LineItemContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <article className="pb-10 last:pb-0">{children}</article>;
};

export const LineItemHeading = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <h3 className="mb-2 text-2xl font-semibold leading-tight text-balance">{children}</h3>;
};

export const LineItemSubheading = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <p className="mb-3 max-w-[65ch] text-base leading-7 text-balance text-gray-600 dark:text-gray-300">
      {children}
    </p>
  );
};
